import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repo";
import { UpdatePasswordDto } from "./dtos/update-password.dto";

@Injectable()
export class ProfileService {
  constructor(private userRepo: UserRepository) {}

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const found = await this.userRepo.findOneOrThrow(
      {
        where: { id },
      },
      "User not found",
    );

    Object.assign(found, { password: dto.newPassword });
    const user = await this.userRepo.save(found);

    return {
      user,
    };
  }

  async getProfile(id: number) {
    return this.userRepo.findOneOrThrow(
      {
        where: { id },
      },
      "User not found",
    );
  }
}
