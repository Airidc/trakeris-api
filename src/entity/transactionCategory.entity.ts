import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class TransactionCategory {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  transactionType!: number;

  @ManyToOne((_type) => User, (user: User) => user.id)
  @JoinColumn()
  user!: User;
}
