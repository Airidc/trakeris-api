import express from "express";
import {
  BasicController,
  InvestmentDTO,
  InvestmentTransactionDTO,
} from "../interface";

export class InvestmentController implements BasicController {
  public path = "/investment";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, this.addInvestment);
    this.router.post(
      `${this.path}/transaction/add`,
      this.addInvestmentTransaction
    );
    // this.router.delete(`${this.path}/delete`, this.deleteInvestment);
    // this.router.post(`${this.path}/getAll`, this.getInvestments);
  }

  private addInvestment = async (
    request: express.Request,
    response: express.Response
  ) => {
    const newInvestment = <InvestmentDTO>request.body;

    // TODO route
    return response.json({ status: "ok" });
  };

  private addInvestmentTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    const newInvTransaction = <InvestmentTransactionDTO>request.body;

    // TODO route
    return response.json({ status: "ok" });
  };
}
