import express from "express";
import controller from './role.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { CreateRoleDto } from "./dtos/create-role.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateRoleDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const roleRouteConfig: RouteConfig = {
  path: '/roles',
  router,
};
