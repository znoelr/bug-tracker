import express from "express";
import controller from './task.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(createRoute(controller.create));

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const taskRouteConfig: RouteConfig = {
  path: '/tasks',
  router,
};
