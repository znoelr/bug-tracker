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

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(FileDto)
);

router.route('/')
  .get(
    parseUrlQueryForQueryOptionsSortBy(FileSortDto),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateFileDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const fileRouteConfig: RouteConfig = {
  path: '/files',
  router,
};
