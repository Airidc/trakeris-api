import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Vault {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  createdAt!: string;

  @Column()
  amount!: number;

  @Column()
  isMultiplyingChange!: boolean;

  @Column()
  multiplier!: number;

  @Column()
  isAddingPeriodically!: boolean;

  @Column()
  periodicAmount!: number;

  @Column()
  targetAmount!: number;

  @Column()
  currency!: string;

  @Column({ name: "UserId" })
  userId!: string;

  @Column()
  periodicInterval!: string;

  @Column()
  nextPeriodicTopup!: number;

  @ManyToOne((_type) => User)
  @JoinColumn({ name: "UserId" })
  user!: User;
}
