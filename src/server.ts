import App from "./app";
import AuthenticationController from "./controllers/auth.controller";
import TransactionController from "./controllers/transaction.controller";
// import PostsController from "./posts/posts.controller";

const app = new App(
  [new AuthenticationController(), new TransactionController()],
  3000
);

app.listen();
