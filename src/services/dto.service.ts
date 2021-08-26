import { Transaction } from "../entity/transaction.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";
import { Vault } from "../entity/vault.entity";
import { TransactionCategoryDTO, TransactionDTO, UserDTO, VaultDTO, VaultTransactionDTO } from "../interface/DTO";
import { v4 as uuidv4 } from "uuid";
import { VaultTransaction } from "../entity/vaultTransaction.entity";
import { User } from "../entity";

export function userToDTO(user: User, refreshToken?: string, refreshTokenExpiry?: number): UserDTO {
  let userDTO = <UserDTO>{
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    userRole: user.userRole,
    profilePicPath: user.profilePicPath,
    firstName: user.firstName,
    lastName: user.lastName,
    currency: user.currency,
  };

  if (refreshToken) userDTO.refreshToken = refreshToken;
  if (refreshTokenExpiry) userDTO.refreshTokenExpiry = refreshTokenExpiry;

  return userDTO;
}

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

export function transactionCategoryToDTO(tc: TransactionCategory): TransactionCategoryDTO {
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

export function vaultTxDTOtoVaultTx(dto: VaultTransactionDTO): VaultTransaction {
  if (!dto.id) dto.id = uuidv4();

  return <VaultTransaction>{
    id: dto.id,
    vaultId: dto.vaultId,
    amount: dto.amount,
    currency: dto.currency,
    createdAt: Date.now() + "",
  };
}
