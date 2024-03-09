import express from "express";
import controller from './role.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDtoAndInjectId } from "../common/validators";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { findResourceByRequestQueryFilters, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../middleware";
import rolePermissionsRouter from './modules/role-permissions/role-permissions.router';
import { trimExistingParamsForKeys } from "../transformers";
import { roleService } from "./role.service";
import { RoleDto } from "./dtos/role.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateRoleDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:roleId/*',
  injectParamsForQueryFilter(
    trimExistingParamsForKeys(['roleId:id'])
  ),
  findResourceByRequestQueryFilters<RoleDto>(roleService),
);

/** Nested task permissions */
router.use(`/:roleId/permissions`, rolePermissionsRouter);

export const roleRouteConfig: RouteConfig = {
  path: '/roles',
  router,
};
