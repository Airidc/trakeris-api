import { getConnection } from "typeorm";
import { dtoService } from ".";
import { Vault } from "../entity";
import { VaultTransaction } from "../entity/vaultTransaction.entity";
import { VaultDTO, VaultTransactionDTO } from "../interface";

export async function AddVault(newVaultDTO: VaultDTO): Promise<Vault> {
  const v = dtoService.vaultDTOtoVault(newVaultDTO);

  await getConnection().getRepository(Vault).save(v);
  return v;
}

export async function AddVaultTransaction(
  newVaultTr: VaultTransactionDTO
): Promise<VaultTransaction> {
  const connection = getConnection();
  const vault = await connection
    .getRepository(Vault)
    .findOneOrFail(newVaultTr.vaultId);
  const queryRunner = connection.createQueryRunner();

  let savedVaultT = new VaultTransaction();
  try {
    queryRunner.startTransaction();
    const amount = vault.amount + newVaultTr.amount;

    const vt = dtoService.vaultTxDTOtoVaultTx(newVaultTr);

    await queryRunner.manager.update(Vault, vault.id, { amount: amount });
    savedVaultT = await queryRunner.manager.save(VaultTransaction, vt);
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    return err;
  } finally {
    await queryRunner.release();
  }

  return savedVaultT;
}
