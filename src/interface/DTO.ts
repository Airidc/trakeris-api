import { TransactionCategory } from "../entity/transactionCategory.entity";
import { User } from "../entity/user.entity";
import { InvestmentAction, InvestmentType } from "../enums/investment.enum";

export interface UserDTO {
  id?: string;
  username: string;
  email: string;
  createdAt: string;
  userRole: string;
  profilePicPath: string;
  firstName: string;
  lastName: string;
  currency: string;
  refreshToken?: string;
  refreshTokenExpiry?: number;
}

export interface TransactionCategoryDTO {
  id?: string;
  name: string;
  type: number;
  userId?: string;
  user?: User;
}

export interface TransactionDTO {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  label: string;
  comment: string;
  categoryId?: string;
  category?: TransactionCategory;
  createdAt?: string;
  time?: string;
}

export interface InvestmentDTO {
  id?: string;
  userId?: string;
  amount: number;
  name: string;
  ticker: string;
  sharePrice: number;
  currency: string;
  createdAt?: string;
}

export interface InvestmentTransactionDTO {
  id?: string;
  userId?: string;
  action: InvestmentAction;
  createdAt?: string;
  time: string;
  type: InvestmentType;
  ticker: string;
  name: string;
  amount: number;
  sharePrice: number;
  currency: string;
  exchangeRate: number;
}

export interface VaultDTO {
  id?: string;
  userId?: string;
  name: string;
  amount: number;
  isMultiplyingChange: boolean;
  multiplier: number;
  isAddingPeriodically: boolean;
  periodicAmount: number;
  targetAmount: number;
  currency: string;
  periodicInterval: string;
  nextPeriodicTopup?: number;
}

export interface VaultTransactionDTO {
  id?: string;
  vaultId: string;
  amount: number;
  currency: string;
  createdAt?: string;
}
