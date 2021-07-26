import express from "express";
import { BasicController, TransactionDTO, VaultDTO } from "../interface";

export class VaultController implements BasicController {
  public path = "/vault";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, this.addVault);
    this.router.post(`${this.path}/transaction/add`, this.addVaultTransaction);
  }

  private addVault = async (
    request: express.Request,
    response: express.Response
  ) => {
    const newVault = <VaultDTO>request.body;
    return response.json({ status: "OK" });
  };

  private addVaultTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    const newVault = <TransactionDTO>request.body;

    return response.json({ status: "OK" });
  };
}
