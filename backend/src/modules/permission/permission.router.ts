import express from "express";
import controller from './permission.controller';
import { routeFactory } from "../common/route-handlers";
import { RouteConfig } from "../common/types";
import {
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../middleware";
import { PermissionSortDto } from "./dtos/permission-sort.dto";
import { PermissionDto } from "./dtos/permission.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(PermissionDto)
);

router.route('/')
  .get(
    parseUrlQueryForQueryOptionsSortBy(PermissionSortDto),
    createRoute(controller.findAll)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById));

export const permissionRouteConfig: RouteConfig = {
  path: '/permissions',
  router,
};
