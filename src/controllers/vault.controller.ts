import express from "express";
import { getConnection } from "typeorm";
import { Vault } from "../entity";
import { BasicController, TransactionDTO, VaultDTO } from "../interface";
import { dtoService } from "../services";

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

    const vault = dtoService.vaultDTOtoVault(dtoVault);

    const x = await getConnection().getRepository(Vault).save(vault);

    return response.json({ vault: x });
  };

  private addVaultTransaction = async (
    request: express.Request,
    response: express.Response
  ) => {
    const newVault = <TransactionDTO>request.body;

    return response.json({ status: "OK" });
  };
}
