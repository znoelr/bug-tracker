import express from "express";
import controller from './role-permissions.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../../../middleware";
import { CreateRolePermissionDto } from "./dtos/create-role-permissions.dto";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { rolePermissionsToPermissions, rolePermissionsParamsToKey, rolePermissionToPermission } from "./transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:roleId' */

const defaultqueryOptions = new QueryOptions()
  .setInclude({ permission: true })

router.use(injectQueryOptions(defaultqueryOptions));

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(
    jsonInterceptor(rolePermissionsToPermissions),
    createRoute(controller.findAll)
  )
  .post(
    validateDto(CreateRolePermissionDto),
    createRoute(controller.create)
  );

router.route('/:permissionId')
  .all(
    jsonInterceptor(rolePermissionToPermission),
    injectParamsForQueryFilter(rolePermissionsParamsToKey)
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
