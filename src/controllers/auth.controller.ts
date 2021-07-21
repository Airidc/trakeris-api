import * as express from "express";
import { UserFields } from "../enums/userFields.enum";
import IBasicController from "../interface/BasicController";
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
    this.router.get(`${this.path}/refresh_token`, this.refreshToken);
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
    const tokenData = await authService.createToken(user);
    response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
    response.send(user);
  };

  private login = async (
    request: express.Request,
    response: express.Response
  ) => {
    const userData: any = request.body;
    let user = await userService.getUserBy(
      UserFields.Username,
      userData.username
    );

    if (!!!user?.checkIfPasswordsMatch(userData.password)) {
      return response.json({ status: "login failed" });
    }

    const tokenData = await authService.createToken(user);
    response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
    return response.json({ status: "login successful", user });
  };

  private logout = async (
    request: express.Request,
    response: express.Response
  ) => {
    response.json({ status: "ok" });
  };

  private refreshToken = async (
    request: express.Request,
    response: express.Response
  ) => {
    const refreshToken = authService.createRefreshToken();
  };
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
