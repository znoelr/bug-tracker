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
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "./permission.constants";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(PermissionDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.PERMISSION),
    parseUrlQueryForQueryOptionsSortBy(PermissionSortDto),
    createRoute(controller.findAll)
  );

router.route('/:id')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.PERMISSION),
    parseParamsForQueryFilter(),
    createRoute(controller.findById)
  );

export const permissionRouteConfig: RouteConfig = {
  path: '/permissions',
  router,
};
