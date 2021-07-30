import App from "./app";
import AuthenticationController from "./controllers/auth.controller";
import TransactionController from "./controllers/transaction.controller";
import { VaultController } from "./controllers/vault.controller";

const app = new App(
  [
    new AuthenticationController(),
    new TransactionController(),
    new VaultController(),
  ],
  3001
);

app.listen();
