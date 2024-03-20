import express from "express";
import controller from './role.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import { CreateRoleDto } from "./dtos/create-role.dto";
import {
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../middleware";
import rolePermissionsRouter from './modules/role-permissions/role-permissions.router';
import { trimObjectForKeys } from "../transformers";
import { roleService } from "./role.service";
import { RoleDto } from "./dtos/role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { validateUniqueKeysFromRequest } from "../middleware";
import { RoleSortDto } from "./dtos/role-sort.dto";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(RoleDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.ROLE),
    parseUrlQueryForQueryOptionsSortBy(RoleSortDto),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.ROLE),
    validateDtoAndInjectId(CreateRoleDto),
    validateUniqueKeysFromRequest<RoleDto>('body')(roleService, ['name']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.ROLE),
    createRoute(controller.findById)
  )
  .patch(
    restrictTo(PERMISSION_ACTION.UPDATE, PERMISSION_RESOURCE.ROLE),
    validateDto(UpdateRoleDto),
    validateUniqueKeysFromRequest<RoleDto>('body')(roleService, ['name']),
    createRoute(controller.update)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.ROLE),
    createRoute(controller.delete)
  );

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:roleId/*',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['roleId:id'])
  ),
  findResourceByRequestQueryFilters<RoleDto>(roleService),
);

/** Nested task permissions */
router.use(`/:roleId/permissions`, rolePermissionsRouter);

export const roleRouteConfig: RouteConfig = {
  path: '/roles',
  router,
};
