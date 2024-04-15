import express from "express";
import controller from './user-roles.controller';
import { routeFactory } from "../../../../common/route-handlers";
import { validateDto } from "../../../../common/validators";
import {
  injectQueryFiltersfromRequest,
  findResourceByRequestQueryFilters,
  throwBadRequestIfResourceExistByQueryFilters,
  createRequestBodyFromParams,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
  endBySendJsonFromRequestBody,
  endBySendStatus,
} from "../../../../middleware";
import { jsonInterceptor } from "../../../../interceptors";
import { CreateUserRolesDto } from "./dtos/create-user-roles.dto";
import { createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../../transformers";
import rolePermissionsRouter from '../../../role/modules/role-permissions/role-permissions.router';
import { userRolesService } from "./user-roles.service";
import { UserRolesDto } from "./dtos/user-roles.dto";
import { RoleDto } from "../../../role/dtos/role.dto";
import { roleService } from "../../../role/role.service";
import { RoleSortDto } from "../../../role/dtos/role-sort.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";
import { resetCachedUserRoles } from "../../../role/modules/role-permissions/middlewares/reset-cached-permissions.middleware";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:userId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(RoleDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('role')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.USER_ROLE),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['userId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(RoleSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('role')),
    jsonInterceptor(toEntityListForKey('role')),
    createRoute(controller.findAll)
  )
;

router.use('/:roleId',
  injectQueryFiltersfromRequest('params')(
    createComposedKeyFromObjectKeys(['userId', 'roleId'])
  )
);

router.route('/:roleId')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.USER_ROLE),
    createRoute(controller.findById, { endRequest: false }),
    jsonInterceptor(toEntityForKey('role')),
    endBySendJsonFromRequestBody
  )
  .put(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.USER_ROLE),
    throwBadRequestIfResourceExistByQueryFilters<UserRolesDto>(userRolesService),
    /** userId already exists, so check for roleId */
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['roleId:id'])
    ),
    findResourceByRequestQueryFilters<RoleDto>(roleService),
    createRequestBodyFromParams(['userId', 'roleId']),
    validateDto(CreateUserRolesDto),
    createRoute(controller.create, { endRequest: false }),
    resetCachedUserRoles,
    jsonInterceptor(toEntityForKey('role')),
    endBySendJsonFromRequestBody
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.USER_ROLE),
    findResourceByRequestQueryFilters<UserRolesDto>(userRolesService),
    createRoute(controller.delete, { endRequest: false }),
    resetCachedUserRoles,
    endBySendStatus(204)
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
