interface TokenData {
  accessToken: string;
  accessExpiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

interface UserDataInToken {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  firstName: string;
  lastName: string;
}

export { TokenData, UserDataInToken };
