import express from "express";
import controller from './user-roles.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import {
  injectQueryFiltersfromRequest,
  findResourceByRequestQueryFilters,
  throwBadRequestIfResourceExistByQueryFilters,
  createRequestBodyFromParams,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
} from "../../../middleware";
import { jsonInterceptor } from "../../../interceptors";
import { CreateUserRolesDto } from "./dtos/create-user-roles.dto";
import { createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../transformers";
import rolePermissionsRouter from '../../../role/modules/role-permissions/role-permissions.router';
import { userRolesService } from "./user-roles.service";
import { UserRolesDto } from "./dtos/user-roles.dto";
import { RoleDto } from "../../../role/dtos/role.dto";
import { roleService } from "../../../role/role.service";
import { RoleSortDto } from "../../../role/dtos/role-sort.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:userId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(RoleDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('role')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.USER),
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.ROLE),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['userId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(RoleSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('role')),
    jsonInterceptor(toEntityListForKey('role')),
    createRoute(controller.findAll)
  )
;

router.route('/:roleId')
  .all(
    injectQueryFiltersfromRequest('params')(
      createComposedKeyFromObjectKeys(['userId', 'roleId'])
    ),
    jsonInterceptor(toEntityForKey('role'))
  )
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.USER),
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.ROLE),
    createRoute(controller.findById)
  )
  .put(
    restrictTo(PERMISSION_ACTION.CREATE_LINK, PERMISSION_RESOURCE.USER),
    restrictTo(PERMISSION_ACTION.CREATE_LINK, PERMISSION_RESOURCE.ROLE),
    throwBadRequestIfResourceExistByQueryFilters<UserRolesDto>(userRolesService),
    /** userId already exists, so check for roleId */
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['roleId:id'])
    ),
    findResourceByRequestQueryFilters<RoleDto>(roleService),
    createRequestBodyFromParams(['userId', 'roleId']),
    validateDto(CreateUserRolesDto),
    createRoute(controller.create)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE_LINK, PERMISSION_RESOURCE.USER),
    restrictTo(PERMISSION_ACTION.DELETE_LINK, PERMISSION_RESOURCE.ROLE),
    findResourceByRequestQueryFilters<UserRolesDto>(userRolesService),
    createRoute(controller.delete)
  )
;

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:roleId/*',
  injectQueryFiltersfromRequest('params')(
    createComposedKeyFromObjectKeys(['userId', 'roleId'])
  ),
  findResourceByRequestQueryFilters<UserRolesDto>(userRolesService),
);

/** Nested role permissions */
router.use(`/:roleId/permissions`, rolePermissionsRouter);

export default router;
