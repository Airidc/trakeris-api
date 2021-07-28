import express from "express";
import { getConnection } from "typeorm";
import { Vault } from "../entity";
import { VaultTransaction } from "../entity/vaultTransaction.entity";
import HttpException from "../exceptions/http.exception";
import { BasicController, VaultDTO, VaultTransactionDTO } from "../interface";
import { dtoService, vaultService } from "../services";

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
    const dtoVault = <VaultDTO>request.body;
    const vault = await vaultService.AddVault(dtoVault);
    return response.json({ vault });
  };

  private addVaultTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const newVaultTrns = <VaultTransactionDTO>request.body;
      const savedVaultT = await vaultService.AddVaultTransaction(newVaultTrns);
      return response.json({ status: "OK", data: savedVaultT });
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  };
}
