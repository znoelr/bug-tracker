import express from "express";
import controller from './permission.controller';
import { routeFactory } from "../common/route-handlers";
import { RouteConfig } from "../common/types";
import { parseParamsForQueryFilter } from "../middleware";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll));

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById));

export const permissionRouteConfig: RouteConfig = {
  path: '/permissions',
  router,
};
