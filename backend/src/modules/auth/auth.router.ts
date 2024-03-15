import express from "express";
import controller from './auth.controller';
import { RouteConfig } from "../common/types";
import { simpleRouteFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { LoginDto } from "./dtos/login.dto";

const router = express.Router();
const createRoute = simpleRouteFactory(controller);

router.post(
  '/login',
  validateDto(LoginDto),
  createRoute(controller.login)
);

router.get('/logout', createRoute(controller.logout));

export const authRouteConfig: RouteConfig = {
  path: '/auth',
  router,
};
