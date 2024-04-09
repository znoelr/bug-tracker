import express from "express";
import controller from './file.controller';
import { RouteConfig } from "../../common/types";
import { routeFactory } from "../../common/route-handlers";
import {
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../../middleware";
import { FileSortDto } from "./dtos/file-sort.dto";
import { FileDto } from "./dtos/file.dto";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(FileDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.FILE),
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    createRoute(controller.findAll)
  )
;

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.FILE),
    createRoute(controller.findById)
  )
;

export const fileRouteConfig: RouteConfig = {
  path: '/files',
  router,
};
