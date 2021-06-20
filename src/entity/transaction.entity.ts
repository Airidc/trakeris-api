import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Transaction {
  @PrimaryColumn()
  id!: string;

  @Column()
  createdAt!: string;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  label!: string;

  //   @Column()
  //   userId!: string;
  //   @ManyToOne((_type) => User, (user: User) => user.transactions)
  //   @JoinColumn()
  //   user!: User;
}
