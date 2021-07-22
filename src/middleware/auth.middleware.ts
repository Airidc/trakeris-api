import express from "express";
import * as jwt from "jsonwebtoken";
import { UserFields } from "../enums/userFields.enum";
import HttpException from "../exceptions/http.exception";
import { userService } from "../services";

export function verifyUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let token = req.headers.authorization;
  if (!token)
    return next(new HttpException(401, "Access Denied / Unauthorized request"));

  try {
    token = token.split(" ")[1];

    if (token === "null" || !token)
      return next(new HttpException(401, "Unauthorized request"));

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET as string); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser)
      return next(new HttpException(400, "Unauthorized request"));

    //req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    next(new HttpException(400, "Invalid Token"));
  }
}

export function checkDuplicateUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const userName = req.body.username;
  const email = req.body.email;

  const userByUsername = userService.getUserBy(UserFields.Username, userName);
  if (!!userByUsername)
    return next(new HttpException(400, "User already exists"));

  const userByEmail = userService.getUserBy(UserFields.Email, email);
  if (!!userByEmail) return next(new HttpException(400, "User already exists"));

  next();
}
