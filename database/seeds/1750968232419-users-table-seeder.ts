import bcrypt from "bcrypt";
import { RolesEnum } from "src/constants/role.enum";
import { User } from "src/modules/user/user.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class UsersTableSeeder1750968232419 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const userRepo = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("1234", 12);

    const users = [
      {
        name: "Admin",
        email: "admin@mail.com",
        password: hashedPassword,
        role: RolesEnum.ADMIN,
        verifiedAt: new Date(),
      },
      {
        name: "User",
        email: "user@mail.com",
        password: hashedPassword,
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
