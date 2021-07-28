import { Transaction } from "../entity/transaction.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";
import { Vault } from "../entity/vault.entity";
import {
  TransactionCategoryDTO,
  TransactionDTO,
  VaultDTO,
  VaultTransactionDTO,
} from "../interface/DTO";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "typeorm";
import { VaultTransaction } from "../entity/vaultTransaction.entity";

export function transactionToDTO(t: Transaction): TransactionDTO {
  return <TransactionDTO>{
    id: t.id,
    userId: t.user.id,
    amount: t.amount,
    currency: t.currency,
    label: t.label,
    comment: t.comment,
    category: t.category,
    createdAt: t.createdAt,
  };
}

export function transactionCategoryToDTO(
  tc: TransactionCategory
): TransactionCategoryDTO {
  return <TransactionCategoryDTO>{
    id: tc.id,
    name: tc.name,
    type: tc.transactionType,
  };
}

export function vaultDTOtoVault(dto: VaultDTO): Vault {
  if (!dto.id) dto.id = uuidv4();

  return <Vault>{
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    createdAt: Date.now() + "",
    isMultiplyingChange: dto.isMultiplyingChange,
    multiplier: dto.multiplier,
    isAddingPeriodically: dto.isAddingPeriodically,
    periodicAmount: dto.periodicAmount,
    targetAmount: dto.targetAmount,
    currency: dto.currency,
    userId: dto.userId,
    periodicInterval: dto.periodicInterval,
    nextPeriodicTopup: dto.nextPeriodicTopup,
  };
}

export function vaultTxDTOtoVaultTx(
  dto: VaultTransactionDTO
): VaultTransaction {
  if (!dto.id) dto.id = uuidv4();

  return <VaultTransaction>{
    id: dto.id,
    vaultId: dto.vaultId,
    amount: dto.amount,
    currency: dto.currency,
    createdAt: Date.now() + "",
  };
}
