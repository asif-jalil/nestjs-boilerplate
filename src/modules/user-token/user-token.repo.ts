import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseRepository } from "src/common/base.repo";
import { Repository } from "typeorm";
import { UserToken } from "./user-token.entity";

@Injectable()
export class UserTokenRepository extends BaseRepository<UserToken> {
  constructor(@InjectRepository(UserToken) repo: Repository<UserToken>) {
    super(repo);
  }
}
