import express from "express";
import controller from './user.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { CreateUserDto } from "./dtos/create-user.dto";
import { parseParamsForQueryFilter } from "../middleware";
import userRolesRouter from './modules/user-roles/user-roles.router';

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

/** Nested user roles */
router.use(`/:userId/roles`, userRolesRouter);

export const userRouteConfig: RouteConfig = {
  path: '/users',
  router,
};
