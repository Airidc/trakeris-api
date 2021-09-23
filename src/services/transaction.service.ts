import { getConnection } from "typeorm";
import { parse } from "url";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../entity/transaction.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";
import { User } from "../entity/user.entity";
import { GroupByType } from "../enums/groupBy";
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
    createdAt: transactionDto.createdAt || Date.now().toString(),
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

export async function getAllTransactions(userId: string): Promise<Transaction[]> {
  const connection = getConnection();

  const transactions = await connection.getRepository(Transaction).find({ where: { user: userId } });
  console.log("All transactions:", transactions);
  return transactions;
}

let y = {
  income: [
    //loop as rows
    {
      name: "Alga", // => txCategory.name
      values: [
        //column values
        { selector: "2021-03", value: 1325 },
        { selector: "2021-04", value: 1325 },
        { selector: "2021-05", value: 1325 },
        { selector: "2021-06", value: 1325 },
      ],
    },
  ],
  expenses: [
    // loop as rows
    {
      name: "Islaidos",
      values: [
        // loop as column values
        { selector: "2021-03", value: 1325 },
        { selector: "2021-04", value: 1325 },
        { selector: "2021-05", value: 1325 },
        { selector: "2021-06", value: 1325 },
      ],
    },
  ],
};

interface SummedUpTransactions {
  income: SummedUpTx[];
  expenses: SummedUpTx[];
}

interface SummedUpTx {
  name: string;
  selector: string;
  value: number;
}

export function groupByMonth(transactions: Transaction[]): any {
  // console.log("Transactions:", transactions);
  let groupedByType = transactions.reduce(
    (groupedData: any, ct) => {
      if (ct.category.transactionType === 1) {
        groupedData.expenses.push(ct);
      } else {
        groupedData.income.push(ct);
      }
      return groupedData;
    },
    { income: [], expenses: [] }
  );

  // console.log("GROUPED:", groupedByType);

  let groupedArray = Object.keys(groupedByType).map((type) => {
    // Income and Expense transaction lists here
    const txs = groupedByType[type];
    const txGroups = txs.reduce((result: any[], tx: Transaction) => {
      let date = new Date(parseInt(tx.createdAt));
      let selectorKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

      // Check if obj with the tx category name was already created previously
      let dataObj = result.find((obj) => obj.name === tx.category.name);
      if (!dataObj) {
        // create new tx categery obj where we sum up monthly data
        // aka new obj which we loop as rows in table
        return [...result, { name: tx.category.name, values: [{ selector: selectorKey, value: tx.amount }] }];
      }

      // Tx category was created in previous iterations.
      // Check if current selector was summed previously
      let selectorObj = dataObj.values.find((v: any) => v.selector === selectorKey);
      if (!selectorObj) {
        dataObj.values.push({ selector: selectorKey, value: tx.amount });
        return result;
      }

      // console.log("Selector value:", selectorObj.value, typeof selectorObj.value, "tx amount:", tx.amount);
      selectorObj["value"] = parseFloat(parseFloat(selectorObj.value).toFixed(2)) + tx.amount;

      return result;
    }, []);

    return { [type]: txGroups };
  });

  return groupedArray;
}
