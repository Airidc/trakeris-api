import * as express from "express";
import { Transaction } from "../entity/transaction.entity";
import IBasicController from "../interface/BasicController";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "typeorm";
import { User } from "../entity/user.entity";
import { TransactionCategory } from "../entity/transactionCategory.entity";

export default class TransactionController implements IBasicController {
  public path = "/transaction";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, this.addTransaction);
    this.router.delete(`${this.path}/delete`, this.deleteTransaction);
    this.router.post(`${this.path}/getAll`, this.getTransactions);
  }

  private addTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    const rb = request.body;

    const user = new User();
    user.id = rb.userId;
    const tc = new TransactionCategory();
    tc.id = rb.categoryId;

    const transaction: Transaction = {
      id: uuidv4(),
      amount: rb.amount,
      currency: rb.currency,
      label: rb.label,
      createdAt: Date.now().toString(),
      user: user,
      category: tc,
      comment: rb.comment,
      type: rb.type,
    };

    //await transactionService.saveTransaction(transaction);
    const connection = getConnection();
    const trns = await connection.getRepository(Transaction).save(transaction);

    return response.json({ ...trns });
  };

  private deleteTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    return response.json({ status: "delete successful" });
  };

  private getTransactions = async (
    request: express.Request,
    response: express.Response
  ) => {
    const rb = request.body;
    const connection = getConnection();
    const trns = await connection
      .getRepository(Transaction)
      .find({ where: { user: rb.userId } });
    return response.json({ transactions: trns });
  };
}
