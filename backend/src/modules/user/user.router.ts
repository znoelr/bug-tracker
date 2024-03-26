import express from "express";
import controller from './user.controller';
import { RouteConfig } from "../../common/types";
import { routeFactory } from "../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../common/validators";
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
} from "../../middleware";
import userRolesRouter from './modules/user-roles/user-roles.router';
import { trimObjectForKeys } from "../../transformers";
import { userService } from "./user.service";
import { UserDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { confirmPasswordValidator } from "./user.validators";
import { UserSortDto } from "./dtos/user-sort.dto";
import { hashUserPassword, setUsernameToLowerCase } from "./transformers";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(UserDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.USER),
    parseUrlQueryForQueryOptionsSortBy(UserSortDto),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.USER),
    validateDtoAndInjectId(CreateUserDto),
    transformRequestBody(
      setUsernameToLowerCase,
      hashUserPassword
    ),
    validateUniqueKeysFromRequest<UserDto>('body')(userService, ['username']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.USER),
    createRoute(controller.findById)
  )
  .patch(
    restrictTo(PERMISSION_ACTION.UPDATE, PERMISSION_RESOURCE.USER),
    findResourceByRequestQueryFilters<UserDto>(userService),
    validateDto(UpdateUserDto),
    validateRequest('body')(confirmPasswordValidator),
    transformRequestBody(hashUserPassword),
    createRequestBodyForKeys({
      paramKeys: [],
      bodyKeys: ['password'],
    }),
    createRoute(controller.update)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.USER),
    findResourceByRequestQueryFilters<UserDto>(userService),
    createRoute(controller.delete)
  );

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
