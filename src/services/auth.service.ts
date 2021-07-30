import * as bcrypt from "bcrypt";
import { TokenData, UserDataInToken } from "../interface/TokenData";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { User } from "../entity/user.entity";
import { dtoService, userService } from ".";
import { UserDTO } from "../interface";

export async function hashPassword(password: string) {
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = await bcrypt.hash(password, salt);

  return { salt, hashedPassword };
}

export async function createToken(user: User): Promise<TokenData> {
  const accessExpiresIn = 60 * 15; // 15min
  const secret = process.env.JWT_SECRET as string;

  const now = Date.now();
  if (!user.refreshToken || user.refreshTokenExpiry > now) {
    // token expired or not set yet
    const refreshToken = createRefreshToken();
    const expiry = 1000 * 60 * 60 * 24 * 7; // 1 week

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = expiry;
    await userService.updateUser(user);
  }

  const dataStoredInToken = dtoService.userToDTO(user);
  dataStoredInToken.refreshToken = user.refreshToken;
  dataStoredInToken.refreshTokenExpiry = user.refreshTokenExpiry;

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
  return `Authorization= Bearer ${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.accessExpiresIn}`;
}
