import express from "express";
import controller from './user.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDtoAndInjectId } from "../common/validators";
import { CreateUserDto } from "./dtos/create-user.dto";
import { findResourceByRequestQueryFilters, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../middleware";
import userRolesRouter from './modules/user-roles/user-roles.router';
import { trimExistingParamsForKeys } from "../transformers";
import { userService } from "./user.service";
import { UserDto } from "./dtos/user.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateUserDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:userId/*',
  injectParamsForQueryFilter(
    trimExistingParamsForKeys(['userId:id'])
  ),
  findResourceByRequestQueryFilters<UserDto>(userService),
);

/** Nested user roles */
router.use(`/:userId/roles`, userRolesRouter);

export const userRouteConfig: RouteConfig = {
  path: '/users',
  router,
};
