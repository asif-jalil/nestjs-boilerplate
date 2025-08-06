import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { ConfirmationType } from "src/constants/confirmation.enum";
import AppException from "src/exceptions/app.exception";
import { UserRepository } from "src/modules/user/user.repo";

@Injectable()
export class IdentityConfirmationGuard implements CanActivate {
  constructor(private userRepo: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = await this.userRepo.findOne({
      select: {
        id: true,
        password: true,
      },
      where: { id: request.user?.id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isPasswordRequired = user?.password && !request.body?.password;

    if (isPasswordRequired) {
      throw new AppException({
        message: {
          message: "Password is required",
          identityConfirmation: ConfirmationType.PASSWORD,
        },
        code: "IdentityConfirmation",
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    return true;
  }
}
