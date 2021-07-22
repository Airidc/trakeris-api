import App from "./app";
import AuthenticationController from "./controllers/auth.controller";
import TransactionController from "./controllers/transaction.controller";

const app = new App(
  [new AuthenticationController(), new TransactionController()],
  3000
);

app.listen();
