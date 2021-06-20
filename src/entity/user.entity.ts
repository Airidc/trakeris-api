import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Transaction } from "./transaction.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column()
  email!: string;

  @Column()
  createdAt!: string;

  @Column()
  userRole!: string;

  @Column({ name: "profilePic" })
  profilePicPath!: string;

  @Column()
  lockoutEnd!: string;

  @Column()
  lockoutEnabled!: number;

  @Column()
  failedAttempts!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  currency!: string;

  checkIfPasswordsMatch(submittedPassword: string): boolean {
    return bcrypt.compareSync(submittedPassword, this.passwordHash);
  }

  // @Column()
  // @OneToMany(
  //   (_type) => Transaction,
  //   (transaction: Transaction) => transaction.userId
  // )
  // @JoinColumn()
  // transactions!: Transaction;
}
