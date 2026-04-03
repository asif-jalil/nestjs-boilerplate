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
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/registration.dto";

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

    const token = await this.token.signToken({
      id: newUser.id
    });

    const userToken = await this.userTokenRepo.create({
      purpose: PurposeEnum.VERIFY_EMAIL,
      token: uuidv7(),
      userId: newUser.id,
      sendCount: 1
    });

    await this.inAppEmailQueue.add(InAppEmail.VERIFY_EMAIL, {
      to: {
        name: newUser.name,
        address: newUser.email
      },
      context: {
        verifyUrl: `${this.env.appConfig.appUrl}/verify/${userToken.token}`,
        name: newUser.name,
        email: newUser.email
      }
    });

    const authUser = await this.getAuthUser(newUser.id);

    return {
      user: authUser,
      token
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({
      select: {
        id: true,
        password: true
      },
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

    const token = await this.token.signToken(restUser);
    const authUser = await this.getAuthUser(user.id);

    return {
      user: authUser,
      token
    };
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

    return {
      user: authUser
    };
  }

  async getAuthUser(userId: number) {
    const [user] = await this.userRepo.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      where: { id: userId }
    });

    return user;
  }
}
