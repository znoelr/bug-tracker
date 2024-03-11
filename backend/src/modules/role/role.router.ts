import express from "express";
import controller from './role.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { findResourceByRequestQueryFilters, injectQueryFiltersfromRequest, parseParamsForQueryFilter } from "../middleware";
import rolePermissionsRouter from './modules/role-permissions/role-permissions.router';
import { trimObjectForKeys } from "../transformers";
import { roleService } from "./role.service";
import { RoleDto } from "./dtos/role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { validateUniqueKeysFromRequest } from "../middleware";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateRoleDto),
    validateUniqueKeysFromRequest<RoleDto>('body')(roleService, ['name']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(
    validateDto(UpdateRoleDto),
    validateUniqueKeysFromRequest<RoleDto>('body')(roleService, ['name']),
    createRoute(controller.update)
  )
  .delete(createRoute(controller.delete));

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
