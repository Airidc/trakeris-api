import { Transaction } from "../entity/transaction.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";
import { TransactionCategoryDTO, TransactionDTO } from "../interface/DTO";

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
