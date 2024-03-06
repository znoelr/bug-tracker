import express from "express";
import controller from './user.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { CreateUserDto } from "./dtos/create-user.dto";
import { parseParamsForQueryFilter } from "../middleware";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateUserDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const userRouteConfig: RouteConfig = {
  path: '/users',
  router,
};
