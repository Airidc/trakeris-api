import * as express from "express";
import { User } from "../entity/user.entity";
import IBasicController from "../interface/BasicController";
import { TokenData, UserDataInToken } from "../interface/TokenData";
import * as jwt from "jsonwebtoken";
// import * as authService from "../services/auth.service";
// import * as userService from "../services/user.service";
import { authService, userService } from "../services";

export default class AuthenticationController implements IBasicController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: any = request.body;
    const { salt, hashedPassword } = await authService.hashPassword(
      userData.password
    );

    const user = await userService.saveUser(userData, salt, hashedPassword);
    const tokenData = this.createToken(user);
    response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
    response.send(user);
  };

  private login = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: any = request.body;
    let user = await userService.getUser(userData);

    if (user?.checkIfPasswordsMatch(userData.password)) {
      return response.json({ status: "login successful" });
    }

    return response.json({ status: "login failed" });
  };

  private logout = async (
    request: express.Request,
    response: express.Response
  ) => {
    response.json({ status: "ok" });
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET as string;
    const dataStoredInToken: UserDataInToken = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePicPath,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {
        expiresIn,
      }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

// export async function registration(
//   request: express.Request,
//   response: express.Response,
//   next: express.NextFunction
// ) {
//   const userData: any = request.body;
//   var salt = bcrypt.genSaltSync(10);
//   var hashedPassword = await bcrypt.hash(userData.password, salt);

//   const connection = getConnection();
//   const user = await connection.getRepository(User).insert({
//     id: uuid(),
//     passwordHash: hashedPassword,
//     salt: salt,
//     email: userData.email,
//     createdAt: Date.now() + "",
//     userRole: "user",
//     firstName: "Airidas",
//     lastName: "Venskus",
//   });

//   response.send(user);
// }
