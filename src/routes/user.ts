import { request, response, Router } from "express";
import verifyUser from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/:id", verifyUser, (request, response) => {
  response.send(`Ok ${request.params.id}`);
});

userRouter.get("/:id/balance", (request, response) => {
  response.send(`OK ID: ${request.params.id}`);
});

userRouter.post("/balance/update", (request, response) => {
  response.send("OK");
});

export default userRouter;
