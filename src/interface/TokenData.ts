interface TokenData {
  token: string;
  expiresIn: number;
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
