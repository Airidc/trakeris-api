import * as express from "express";
import { UserFields } from "../enums/userFields.enum";
import HttpException from "../exceptions/http.exception";
import { BasicController, RefreshTokenData, UserDTO } from "../interface";
import { checkDuplicateUser, verifyUser } from "../middleware/auth.middleware";
import { authService, dtoService, userService } from "../services";

export default class AuthenticationController implements BasicController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, checkDuplicateUser, this.register);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
    this.router.get(`${this.path}/refresh_token`, this.refreshAccessToken);
  }

  private register = async (request: express.Request, response: express.Response) => {
    const userData: any = request.body;
    const { salt, hashedPassword } = await authService.hashPassword(userData.password);

    const user = await userService.createUser(userData, salt, hashedPassword);
    const tokenData = await authService.createToken(user);

    const userDTO: UserDTO = dtoService.userToDTO(user);

    response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
    response.send({
      user: userDTO,
      refreshToken: tokenData.refreshToken,
      refreshTokenExpiry: tokenData.refreshExpiresIn,
    });
  };

  private login = async (request: express.Request, response: express.Response) => {
    const userData: any = request.body;
    let user = await userService.getUserBy(UserFields.Username, userData.username);

    if (!!!user?.checkIfPasswordsMatch(userData.password)) {
      return response.json({ status: "login failed" });
    }

    const tokenData = await authService.createToken(user);
    const userDTO = dtoService.userToDTO(user);

    response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
    return response.json({
      status: "login successful",
      user: userDTO,
      refreshToken: tokenData.refreshToken,
      refreshTokenExpiry: tokenData.refreshExpiresIn,
    });
  };

  private logout = async (request: express.Request, response: express.Response) => {
    response.clearCookie("Authorization");
    response.json({ status: "ok" });
  };

  private refreshAccessToken = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const refreshTokenData: RefreshTokenData = request.body;
      const accessToken: string = request.cookies["Authorization"]?.replace("Bearer ", "") || "";

      let user = await authService.validateRefreshToken(refreshTokenData, accessToken);
      const tokenData = await authService.createToken(user);
      response.setHeader("Set-Cookie", [authService.createCookie(tokenData)]);
      return response.json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  };
}
