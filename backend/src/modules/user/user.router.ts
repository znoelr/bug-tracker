import express from "express";
import controller from './user.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import { CreateUserDto } from "./dtos/create-user.dto";
import {
  createRequestBodyForKeys,
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
  transformRequestBody,
  validateRequest,
  validateUniqueKeysFromRequest,
} from "../middleware";
import userRolesRouter from './modules/user-roles/user-roles.router';
import { trimObjectForKeys } from "../transformers";
import { userService } from "./user.service";
import { UserDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { confirmPasswordValidator } from "./user.validators";
import { UserSortDto } from "./dtos/user-sort.dto";
import { hashUserPassword } from "./transformers";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(UserDto)
);

router.route('/')
  .get(
    parseUrlQueryForQueryOptionsSortBy(UserSortDto),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateUserDto),
    validateUniqueKeysFromRequest<UserDto>('body')(userService, ['username']),
    transformRequestBody(hashUserPassword),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(
    validateDto(UpdateUserDto),
    validateUniqueKeysFromRequest<UserDto>('body')(userService, ['username']),
    validateRequest('body')(confirmPasswordValidator),
    createRequestBodyForKeys({
      paramKeys: [],
      bodyKeys: ['username', 'password'],
    }),
    createRoute(controller.update)
  )
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:userId/*',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['userId:id'])
  ),
  findResourceByRequestQueryFilters<UserDto>(userService),
);

/** Nested user roles */
router.use(`/:userId/roles`, userRolesRouter);

export const userRouteConfig: RouteConfig = {
  path: '/users',
  router,
};
