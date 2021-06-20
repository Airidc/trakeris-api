import { Router } from "express";

export default interface BasicController {
  path: string;
  router: Router;
}
