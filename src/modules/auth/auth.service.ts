import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { PurposeEnum } from "src/constants/purpose.enum";
import { InAppEmail } from "src/constants/queue.enum";
import { RolesEnum } from "src/constants/role.enum";
import { InjectInAppEmail } from "src/decorators/inject-queue.decorator";
import BadRequestException from "src/exceptions/bad-request.exception";
import NotFoundException from "src/exceptions/not-found.exception";
import UnauthenticatedException from "src/exceptions/unauthenticated.exception";
import { EnvService } from "src/shared/services/env.service";
import { TokenService } from "src/shared/services/token.service";
import { v7 as uuidv7 } from "uuid";
import { BaseEmailData } from "../queue/consumers/in-app-email.consumer";
import { UserTokenRepository } from "../user-token/user-token.repo";
import { UserRepository } from "../user/user.repo";
import * as AppConfig from "./../../config/app";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/registration.dto";
import { ResendVerificationDto } from "./dtos/resend-verification.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly token: TokenService,
    private readonly userRepo: UserRepository,
    private readonly userTokenRepo: UserTokenRepository,
    private readonly env: EnvService,
    @InjectInAppEmail() private readonly inAppEmailQueue: Queue<BaseEmailData>
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const newUser = await this.userRepo.create({
      name,
      email,
      password,
      role: RolesEnum.OWNER
    });

    const authToken = await this.token.signToken({ id: newUser.id });

    const userToken = await this.userTokenRepo.create({
      purpose: PurposeEnum.VERIFY_EMAIL,
      token: uuidv7(),
      userId: newUser.id,
      sendCount: 1
    });

    await this.inAppEmailQueue.add(InAppEmail.VERIFY_EMAIL, {
      to: { name: newUser.name, address: newUser.email },
      context: {
        verifyUrl: `${this.env.appConfig.appUrl}/verify/${userToken.token}`,
        name: newUser.name,
        email: newUser.email
      }
    });

    const authUser = await this.getAuthUser(newUser.id);

    return { user: authUser, token: authToken };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({
      select: { id: true, password: true },
      where: { email }
    });

    if (!user?.password) {
      throw new NotFoundException({
        email: "Email and password does not match",
        password: "Email and password does not match"
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        email: "Email and password does not match",
        password: "Email and password does not match"
      });
    }

    const { password: _, ...restUser } = user;

    const authToken = await this.token.signToken(restUser);
    const authUser = await this.getAuthUser(user.id);

    return { user: authUser, token: authToken };
  }

  async authAccount(token: string) {
    if (!token) {
      throw new BadRequestException("Invalid request");
    }

    const payload = this.token.decodeToken(token);

    if (!payload.isValid) {
      throw new UnauthenticatedException("You are not authenticated");
    }

    const user = await this.userRepo.findOne({
      select: { id: true },
      where: { id: payload.decoded?.id }
    });

    if (!user) {
      throw new NotFoundException("Invalid user");
    }

    const authUser = await this.getAuthUser(user.id);

    return { user: authUser };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { token } = dto;

    const userToken = await this.userTokenRepo.findOne({
      where: { token, purpose: PurposeEnum.VERIFY_EMAIL }
    });

    if (!userToken) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    if (userToken.isExpired(AppConfig.VERIFY_EMAIL_EXPIRY_MINUTES)) {
      await this.userTokenRepo.delete(userToken.id);
      throw new BadRequestException("Verification link has expired. Please request a new one");
    }

    const user = await this.userRepo.findOneOrThrow({
      select: { id: true, name: true, email: true, verifiedAt: true },
      where: { id: userToken.userId }
    });

    if (user.verifiedAt) {
      await this.userTokenRepo.delete(userToken.id);
      throw new BadRequestException("Email is already verified");
    }

    await this.userRepo.update(user.id, { verifiedAt: new Date() });
    await this.userTokenRepo.delete(userToken.id);

    await this.inAppEmailQueue.add(InAppEmail.WELCOME_EMAIL, {
      to: { name: user.name, address: user.email },
      context: { name: user.name }
    });

    return { message: "Email verified successfully" };
  }

  async resendVerification(dto: ResendVerificationDto) {
    // Always return success to avoid revealing whether email exists
    const user = await this.userRepo.findOne({
      select: { id: true, name: true, email: true, verifiedAt: true },
      where: { email: dto.email }
    });

    if (!user || user.verifiedAt) {
      return { message: "If this email exists and is unverified, a new verification email has been sent" };
    }

    const existing = await this.userTokenRepo.findOne({
      where: { userId: user.id, purpose: PurposeEnum.VERIFY_EMAIL }
    });

    if (existing && existing.sendCount >= AppConfig.MAX_VERIFICATION_SEND_COUNT) {
      return { message: "You have reached maximum verification limit, contact support" };
    }

    if (existing) {
      await this.userTokenRepo.update(
        { userId: user.id, purpose: PurposeEnum.VERIFY_EMAIL },
        {
          sendCount: existing.sendCount + 1
        }
      );

      await this.inAppEmailQueue.add(InAppEmail.VERIFY_EMAIL, {
        to: { name: user.name, address: user.email },
        context: {
          verifyUrl: `${this.env.appConfig.appUrl}/verify/${existing.token}`,
          name: user.name,
          email: user.email
        }
      });
    } else {
      const userToken = await this.userTokenRepo.create({
        purpose: PurposeEnum.VERIFY_EMAIL,
        token: uuidv7(),
        userId: user.id,
        sendCount: 1
      });

      await this.inAppEmailQueue.add(InAppEmail.VERIFY_EMAIL, {
        to: { name: user.name, address: user.email },
        context: {
          verifyUrl: `${this.env.appConfig.appUrl}/verify/${userToken.token}`,
          name: user.name,
          email: user.email
        }
      });
    }

    return { message: "If this email exists and is unverified, a new verification email has been sent" };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Always return success to avoid revealing whether email exists
    const user = await this.userRepo.findOne({
      select: { id: true, name: true, email: true },
      where: { email: dto.email }
    });

    if (!user) {
      return { message: "If this email is registered, you will receive a password reset link shortly" };
    }

    await this.userTokenRepo.delete({ userId: user.id, purpose: PurposeEnum.RESET_PASSWORD });

    const userToken = await this.userTokenRepo.create({
      purpose: PurposeEnum.RESET_PASSWORD,
      token: uuidv7(),
      userId: user.id,
      sendCount: 1
    });

    await this.inAppEmailQueue.add(InAppEmail.RESET_PASSWORD, {
      to: { name: user.name, address: user.email },
      context: {
        resetUrl: `${this.env.appConfig.appUrl}/reset-password/${userToken.token}`,
        name: user.name,
        email: user.email
      }
    });

    return { message: "If this email is registered, you will receive a password reset link shortly" };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, password } = dto;

    const userToken = await this.userTokenRepo.findOne({
      where: { token, purpose: PurposeEnum.RESET_PASSWORD }
    });

    if (!userToken) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    if (userToken.isExpired(AppConfig.RESET_PASSWORD_EXPIRY_MINUTES)) {
      await this.userTokenRepo.delete(userToken.id);
      throw new BadRequestException("Password reset link has expired. Please request a new one");
    }

    // Load entity without select restriction so @BeforeUpdate lifecycle hook hashes the new password via save()
    const user = await this.userRepo.findOneOrThrow({ where: { id: userToken.userId } });

    user.password = password;
    await this.userRepo.save(user);

    await this.userTokenRepo.delete({ userId: user.id, purpose: PurposeEnum.RESET_PASSWORD });

    return { message: "Password has been reset successfully" };
  }

  async getAuthUser(userId: number) {
    const [user] = await this.userRepo.findMany({
      select: { id: true, name: true, email: true, role: true },
      where: { id: userId }
    });

    return user;
  }
}
