import * as express from "express";
import { UserFields } from "../enums/userFields.enum";
import { BasicController } from "../interface";
import { checkDuplicateUser, verifyUser } from "../middleware/auth.middleware";
import { authService, dtoService, userService } from "../services";

export default class AuthenticationController implements BasicController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      checkDuplicateUser,
      this.register
    );
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

    // const userDTO = dtoService.userToDTO(user);
    const tokenData = await authService.createToken(user);
    response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
    return response.json({ status: "login successful" });
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

    //TODO: Finish refresh token implementation L8HVUJ80AE3VO7RG
  };
}
