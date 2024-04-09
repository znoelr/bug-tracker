import express from "express";
import controller from './log.controller';
import { routeFactory } from "../../common/route-handlers";
import {
  injectQueryFiltersfromRequest,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
} from "../../middleware";
import { trimObjectForKeys } from "../../transformers";
import { LogDto } from "./dtos/log.dto";
import { LogSortDto } from "./dtos/log-sort.dto";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(LogDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.LOG),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(LogSortDto),
    createRoute(controller.findAll)
  );

router.route('/:id')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.LOG),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId', 'id'])
    ),
    createRoute(controller.findById)
  );

export default router;
