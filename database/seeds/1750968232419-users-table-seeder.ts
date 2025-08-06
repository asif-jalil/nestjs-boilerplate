import { RolesEnum } from "src/constants/role.enum";
import { User } from "src/modules/user/user.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class UsersTableSeeder1750968232419 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const userRepo = dataSource.getRepository(User);

    const users = [
      {
        name: "Admin",
        email: "admin@mail.com",
        password: "defaultPass123!",
        role: RolesEnum.ADMIN,
        verifiedAt: new Date(),
      },
      {
        name: "Reseller",
        email: "reseller@mail.com",
        password: "defaultPass123!",
        role: RolesEnum.RESELLER,
        verifiedAt: new Date(),
      },
      {
        name: "User",
        email: "user@mail.com",
        password: "defaultPass123!",
        role: RolesEnum.USER,
        verifiedAt: new Date(),
      },
    ];

    await userRepo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .orIgnore()
      .execute();
  }
}
