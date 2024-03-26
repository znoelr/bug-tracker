import express from "express";
import controller from './auth.controller';
import { RouteConfig } from "../../common/types";
import { simpleRouteFactory } from "../../common/route-handlers";
import { validateDto } from "../../common/validators";
import { LoginDto } from "./dtos/login.dto";
import { authMiddleware } from "./middlewares/auth.middleware";

const router = express.Router();
const createRoute = simpleRouteFactory(controller);

router.post(
  '/login',
  validateDto(LoginDto),
  createRoute(controller.login)
);

router.get(
  '/logout',
  authMiddleware,
  createRoute(controller.logout)
);

router.get(
  '/refresh',
  createRoute(controller.refreshToken)
);

export const authRouteConfig: RouteConfig = {
  path: '/auth',
  router,
};
