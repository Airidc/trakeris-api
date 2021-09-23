import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { ColumnNumericTransformer } from "../utilities/converters";
import { TransactionCategory } from "./transactionCategory.entity";
import { User } from "./user.entity";

@Entity()
export class Transaction {
  @PrimaryColumn()
  id!: string;

  @Column()
  createdAt!: string;

  @Column("numeric", {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  label!: string;

  @ManyToOne((_type) => TransactionCategory, (tc: TransactionCategory) => tc.id, { eager: true })
  @JoinColumn()
  category!: TransactionCategory;

  @Column()
  comment!: string;

  @ManyToOne((_type) => User, (user: User) => user.id)
  @JoinColumn()
  user!: User;
}
