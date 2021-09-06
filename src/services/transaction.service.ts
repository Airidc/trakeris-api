import { getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../entity/transaction.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";
import { User } from "../entity/user.entity";
import { TransactionCategoryDTO, TransactionDTO } from "../interface/DTO";

export async function saveTransaction(transactionDto: TransactionDTO): Promise<Transaction> {
  const connection = getConnection();
  const user = new User();
  user.id = transactionDto.userId;

  let tc;
  try {
    tc = await connection.getRepository(TransactionCategory).findOneOrFail(transactionDto.categoryId);
  } catch (error) {
    throw Error("Invalid Transaction category ID");
  }

  const transaction: Transaction = {
    id: uuidv4(),
    amount: transactionDto.amount,
    currency: transactionDto.currency,
    label: transactionDto.label,
    createdAt: Date.now().toString(),
    user: user,
    category: tc,
    comment: transactionDto.comment,
  };

  //await transactionService.saveTransaction(transaction);
  await connection.getRepository(Transaction).save(transaction);
  return transaction;
}

export async function saveTransactionCategory(
  transactionCategoryDTO: TransactionCategoryDTO
): Promise<TransactionCategory> {
  const connection = getConnection();

  let user: User;
  try {
    user = await connection.getRepository(User).findOneOrFail(transactionCategoryDTO.userId);
  } catch (error) {
    throw Error("User not found for transaction category.");
  }

  const transactionCategory: TransactionCategory = {
    id: uuidv4(),
    name: transactionCategoryDTO.name,
    transactionType: transactionCategoryDTO.type,
    user: user,
  };

  return await connection.getRepository(TransactionCategory).save(transactionCategory);
}
