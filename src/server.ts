import App from "./app";
import AuthenticationController from "./controllers/auth.controller";
// import PostsController from "./posts/posts.controller";

const app = new App([new AuthenticationController()], 3000);

app.listen();
