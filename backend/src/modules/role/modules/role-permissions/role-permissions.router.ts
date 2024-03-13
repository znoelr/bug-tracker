import express from "express";
import controller from './role-permissions.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import {
  injectQueryOptions,
  injectQueryFiltersfromRequest,
  throwBadRequestIfResourceExistByQueryFilters,
  findResourceByRequestQueryFilters,
  createRequestBodyFromParams,
  parseUrlQueryForQueryOptionsSortBy,
  injectTransformedQueryOptions,
} from "../../../middleware";
import { CreateRolePermissionDto } from "./dtos/create-role-permissions.dto";
import { QueryOptions } from "../../../common/types";
import { jsonInterceptor } from "../../../interceptors";
import { createComposedKeyFromObjectKeys,
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

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:roleId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ permission: true })
));

router.route('/')
  .get(
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
  .get(createRoute(controller.findById))
  .put(
    throwBadRequestIfResourceExistByQueryFilters<RolePermissionsDto>(rolePermissionsService),
    /** roleId already exists, so check for permissionId */
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['permissionId:id']),
    ),
    findResourceByRequestQueryFilters<PermissionDto>(permissionService),
    createRequestBodyFromParams(['roleId', 'permissionId']),
    validateDto(CreateRolePermissionDto),
    createRoute(controller.create)
  )
  .delete(
    findResourceByRequestQueryFilters<RolePermissionsDto>(rolePermissionsService),
    createRoute(controller.delete)
  )
;

export default router;
