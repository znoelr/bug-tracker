import express from "express";
import controller from './user-roles.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectQueryFiltersfromRequest, findResourceByRequestQueryFilters, throwBadRequestIfResourceExistByQueryFilters, createRequestBodyFromParams } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CreateUserRolesDto } from "./dtos/create-user-roles.dto";
import { createComposedKeyFromObjectKeys, toEntityForKey, toEntityListForKey, trimObjectForKeys } from "../../../transformers";
import rolePermissionsRouter from '../../../role/modules/role-permissions/role-permissions.router';
import { userRolesService } from "./user-roles.service";
import { UserRolesDto } from "./dtos/user-roles.dto";
import { RoleDto } from "../../../role/dtos/role.dto";
import { roleService } from "../../../role/role.service";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:userId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ role: true })
));

router.route('/')
  .get(
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['userId'])
    ),
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
  .get(createRoute(controller.findById))
  .put(
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
