import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { createConnection } from "typeorm";
import { Transaction, TransactionCategory, User, Vault } from "./entity";
import { VaultTransaction } from "./entity/vaultTransaction.entity";
import { BasicController } from "./interface";
import errorMiddleware from "./middleware/error.middleware";

var cors = require("cors");
require("dotenv").config();

export default class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: BasicController[], port: number) {
    this.app = express();
    this.port = port || 3000;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private async initializeDbConnection() {
    try {
      await createConnection({
        name: "default",
        type: "mysql",
        host: "localhost",
        extra: {
          decimalNumbers: true,
        },
        entities: [User, TransactionCategory, Transaction, Vault, VaultTransaction],
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        database: process.env.DB_TABLE,
      });
    } catch (error) {
      console.log("Unable to connect to db", error);
      process.exit(1);
    }
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(cors({ origin: "*" }));
  }

  private initializeControllers(controllers: BasicController[]) {
    controllers.forEach((controller: BasicController) => {
      this.app.use("/api", controller.router);
    });
  }

  public async listen() {
    try {
      await this.initializeDbConnection();
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
      });
    } catch (error) {
      console.error(`Error occured: ${error.message}`);
    }
  }
}
