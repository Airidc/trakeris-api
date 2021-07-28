import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class VaultTransaction {
  @PrimaryColumn()
  id!: string;

  @Column()
  vaultId!: string;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  createdAt!: string;
}
