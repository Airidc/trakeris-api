import { TransactionCategory } from "../entity/transactionCategory.entity";
import { User } from "../entity/user.entity";

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
}
