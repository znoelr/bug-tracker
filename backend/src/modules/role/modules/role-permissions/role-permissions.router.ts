import express from "express";
import controller from './role-permissions.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import {
  injectQueryFiltersfromRequest,
  throwBadRequestIfResourceExistByQueryFilters,
  findResourceByRequestQueryFilters,
  createRequestBodyFromParams,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
  parseUrlQueryForQueryOptionsSelect,
} from "../../../middleware";
import { CreateRolePermissionDto } from "./dtos/create-role-permissions.dto";
import { jsonInterceptor } from "../../../interceptors";
import { createComposedKeyFromObjectKeys,
  injectSelectOrIncludeQueryOptionsForKey,
  toEntityForKey,
  toEntityListForKey,
  trimObjectForKeys,
  trimOnlyFirstEntryOfSortByForField,
} from "../../../transformers";
import { RolePermissionsDto } from "./dtos/role-permissions.dto";
import { rolePermissionsService } from "./role-permissions.service";
import { PermissionDto } from "../../../permission/dtos/permission.dto";
import { permissionService } from "../../../permission/permission.service";
import { PermissionSortDto } from "../../../permission/dtos/permission-sort.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";
import { resetCachedPermissions } from "./middlewares/reset-cached-permissions.middleware";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:roleId' */

router.use(
  parseUrlQueryForQueryOptionsSelect(PermissionDto),
  injectTransformedQueryOptions(injectSelectOrIncludeQueryOptionsForKey('permission')),
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.ROLE),
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.PERMISSION),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['roleId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(PermissionSortDto),
    injectTransformedQueryOptions(trimOnlyFirstEntryOfSortByForField('permission')),
    jsonInterceptor(toEntityListForKey('permission')),
    createRoute(controller.findAll)
  )
;

router.route('/:permissionId')
  .all(
    injectQueryFiltersfromRequest('params')(
      createComposedKeyFromObjectKeys(['roleId', 'permissionId'])
    ),
    jsonInterceptor(toEntityForKey('permission'))
  )
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.ROLE),
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.PERMISSION),
    createRoute(controller.findById)
  )
  .put(
    restrictTo(PERMISSION_ACTION.CREATE_LINK, PERMISSION_RESOURCE.ROLE),
    restrictTo(PERMISSION_ACTION.CREATE_LINK, PERMISSION_RESOURCE.PERMISSION),
    throwBadRequestIfResourceExistByQueryFilters<RolePermissionsDto>(rolePermissionsService),
    /** roleId already exists, so check for permissionId */
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['permissionId:id']),
    ),
    findResourceByRequestQueryFilters<PermissionDto>(permissionService),
    createRequestBodyFromParams(['roleId', 'permissionId']),
    validateDto(CreateRolePermissionDto),
    resetCachedPermissions,
    createRoute(controller.create)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE_LINK, PERMISSION_RESOURCE.ROLE),
    restrictTo(PERMISSION_ACTION.DELETE_LINK, PERMISSION_RESOURCE.PERMISSION),
    findResourceByRequestQueryFilters<RolePermissionsDto>(rolePermissionsService),
    resetCachedPermissions,
    createRoute(controller.delete)
  )
;

export default router;
