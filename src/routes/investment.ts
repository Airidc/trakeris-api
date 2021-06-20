import { Router } from "express";

const investmentRouter = Router();

investmentRouter.get("/:id/all", (request, response) => {
  response.send(`All investments for ID: ${request.params.id}`);
});

investmentRouter.post("add", (request, response) => {
  response.send("Added investment");
});

export default investmentRouter;
