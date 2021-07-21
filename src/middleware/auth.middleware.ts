import express from "express";
import * as jwt from "jsonwebtoken";
import { userService } from "../services";

export default function verifyUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send("Access Denied / Unauthorized request");

  try {
    token = token.split(" ")[1];

    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET as string); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).send("Unauthorized request");

    //req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}

export function checkDuplicateUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const userName = req.body.username;
  const email = req.body.email;

  // const user = userService.getUserBy(userName, email);
}
