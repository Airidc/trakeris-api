import * as express from "express";
import IBasicController from "../interface/BasicController";
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

  async register(request: express.Request, response: express.Response) {
    const userData: any = request.body;
    const { salt, hashedPassword } = await authService.hashPassword(
      userData.password
    );

    const user = await userService.saveUser(userData, salt, hashedPassword);

    response.send(user);
  }

  async login(request: express.Request, response: express.Response) {
    const userData: any = request.body;
    let user = await userService.getUser(userData);

    if (user?.checkIfPasswordsMatch(userData.password)) {
      return response.json({ status: "login successful" });
    }

    return response.json({ status: "login failed" });
  }

  logout(request: express.Request, response: express.Response) {
    response.json({ status: "ok" });
  }
}

function NoAuth() {
  throw new Error("Function not implemented.");
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
