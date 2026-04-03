import { Module } from "@nestjs/common";
import { UserTokenModule } from "../user-token/user-token.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule, UserTokenModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
