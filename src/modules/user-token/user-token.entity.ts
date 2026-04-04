import moment from "moment";
import { AbstractEntity } from "src/common/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity({
  name: "userTokens"
})
export class UserToken extends AbstractEntity {
  @Column({ type: "int", nullable: false, unsigned: true })
  userId: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  purpose: string;

  @Column({ type: "varchar", length: 36, nullable: false })
  token: string;

  @Column({ type: "int", nullable: false, default: 0 })
  sendCount: number;

  @ManyToOne(() => User)
  user: User;

  public isExpired(minutes = 5) {
    return moment(this.updatedAt) < moment().subtract(minutes, "minutes");
  }
}
