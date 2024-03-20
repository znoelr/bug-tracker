import express from "express";
import controller from './file.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDtoAndInjectId } from "../common/validators";
import { CreateFileDto } from "./dtos/create-file.dto";
import {
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../middleware";
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
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.FILE),
    validateDtoAndInjectId(CreateFileDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.FILE),
    createRoute(controller.findById)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.FILE),
    createRoute(controller.delete)
  );

export const fileRouteConfig: RouteConfig = {
  path: '/files',
  router,
};
