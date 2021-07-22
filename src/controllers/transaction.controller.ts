import * as express from "express";
import { Transaction } from "../entity/transaction.entity";
import { getConnection } from "typeorm";
import { TransactionCategoryDTO, TransactionDTO } from "../interface/DTO";
import { dtoService, transactionService } from "../services";
import { BasicController } from "../interface";

export default class TransactionController implements BasicController {
  public path = "/transaction";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, this.addTransaction);
    this.router.delete(`${this.path}/delete`, this.deleteTransaction);
    this.router.post(`${this.path}/getAll`, this.getTransactions);
    this.router.post(`${this.path}/category/add`, this.addTransactionCategory);
  }

  private addTransactionCategory = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const transactionCategoryDTO = <TransactionCategoryDTO>request.body;

    const tc = await transactionService.saveTransactionCategory(
      transactionCategoryDTO
    );

    return response.json({ ...dtoService.transactionCategoryToDTO(tc) });
  };

  private addTransaction = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const transactionDTO = <TransactionDTO>request.body;

    let transaction;
    try {
      transaction = await transactionService.saveTransaction(transactionDTO);
    } catch (error) {
      return next(error);
    }

    return response.json({ ...dtoService.transactionToDTO(transaction) });
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
