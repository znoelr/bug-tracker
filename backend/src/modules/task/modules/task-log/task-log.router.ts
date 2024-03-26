import express from "express";
import controller from './task-log.controller';
import { routeFactory } from "../../../../common/route-handlers";
import { injectQueryFiltersfromRequest, parseUrlQueryForQueryOptionsSelect, parseUrlQueryForQueryOptionsSortBy } from "../../../../middleware";
import { trimObjectForKeys } from "../../../../transformers";
import { TaskLogDto } from "./dtos/task-log.dto";
import { TaskLogSortDto } from "./dtos/task-log-sort.dto";
import { restrictTo } from "../../../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../../../permission/permission.constants";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED FOR '/:taskId' PREFIX */

router.use(
  parseUrlQueryForQueryOptionsSelect(TaskLogDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.TASK_LOG),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId'])
    ),
    parseUrlQueryForQueryOptionsSortBy(TaskLogSortDto),
    createRoute(controller.findAll)
  );

router.route('/:id')
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.TASK_LOG),
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId', 'id'])
    ),
    createRoute(controller.findById)
  );

export default router;
