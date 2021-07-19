import * as express from "express";
import IBasicController from "../interface/BasicController";

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
    return response.json({ status: "add successful" });
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
    return response.json({ status: "get successful" });
  };
}
