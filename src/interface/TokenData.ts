import { User } from "../entity";

export interface TokenData {
  accessToken: string;
  accessExpiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface UserDataInToken {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenData {
  refreshToken: string;
  refreshTokenExpiry: number;
}
