import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToken } from "./user-token.entity";
import { UserTokenRepository } from "./user-token.repo";

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [UserTokenRepository],
  exports: [UserTokenRepository]
})
export class UserTokenModule {}
