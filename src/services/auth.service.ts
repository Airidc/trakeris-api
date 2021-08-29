import * as bcrypt from "bcrypt";
import { RefreshTokenData, TokenData, UserDataInToken } from "../interface/TokenData";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { User } from "../entity/user.entity";
import { dtoService, userService } from ".";
import { UserDTO } from "../interface";
import { UserFields } from "../enums/userFields.enum";
import HttpException from "../exceptions/http.exception";
import express, { response } from "express";

export async function hashPassword(password: string) {
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = await bcrypt.hash(password, salt);

  return { salt, hashedPassword };
}

export async function createToken(user: User): Promise<TokenData> {
  const accessExpiresIn = 60 * 1; // 15min
  const secret = process.env.JWT_SECRET as string;

  // TODO: Handle expiration seperately
  // const now = Date.now();
  //  || user.refreshTokenExpiry < now
  if (!user.refreshToken) {
    // token expired or not set yet
    const refreshToken = createRefreshToken();
    const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 1 week

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = expiry;
    await userService.updateUser(user);
  }

  const dataStoredInToken = dtoService.userToDTO(user);

  return {
    accessExpiresIn,
    accessToken: jwt.sign(dataStoredInToken, secret, {
      expiresIn: accessExpiresIn,
    }),
    refreshToken: user.refreshToken,
    refreshExpiresIn: user.refreshTokenExpiry,
  };
}

export function createRefreshToken() {
  return crypto.randomBytes(32).toString("base64");
}

export function createCookie(tokenData: TokenData): string {
  return `Authorization=Bearer ${tokenData.accessToken};`;
}

export async function validateRefreshToken(refreshData: RefreshTokenData, accessToken: string): Promise<any> {
  try {
    // Throws error if jwt is expired
    jwt.verify(accessToken, process.env.JWT_SECRET as string);
    throw new HttpException(200, "Current access token is still valid");
  } catch (error: any | jwt.JsonWebTokenError) {
    if (!(error instanceof jwt.TokenExpiredError)) throw error;

    // If reached, token is expired and needs renewing.
    const jwtDecoded = jwt.decode(accessToken) as User;
    if (!jwtDecoded) throw new HttpException(400, "Access token to be refreshed is invalid");

    let user = await userService.getUserBy(UserFields.Username, jwtDecoded.username);
    if (!user) throw new HttpException(500, "Could not refresh the access token. Please sign-in again.");

    if (user.refreshToken !== refreshData.refreshToken) {
      throw new HttpException(400, "Invalid refresh token");
    }

    if (user.refreshTokenExpiry < refreshData.refreshTokenExpiry)
      throw new HttpException(400, "Refresh token expired, please log in again.");

    return user;
  }
}
