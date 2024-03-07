import express from "express";
import controller from './role.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { parseParamsForQueryFilter } from "../middleware";
import rolePermissionsRouter from './modules/role-permissions/role-permissions.router';

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateRoleDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

/** Nested task permissions */
router.use(`/:roleId/permissions`, rolePermissionsRouter);

export const roleRouteConfig: RouteConfig = {
  path: '/roles',
  router,
};
