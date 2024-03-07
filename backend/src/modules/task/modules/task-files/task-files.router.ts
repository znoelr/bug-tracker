import express from "express";
import controller from './task-files.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { taskFileToFile, taskFilesParamsToKey, taskFilesToFiles } from "./transformers";
import { CreateTaskFilesDto } from "./dtos/create-task-files.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

const defaultqueryOptions = new QueryOptions()
  .setInclude({ file: true })

router.use(injectQueryOptions(defaultqueryOptions));

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(
    jsonInterceptor(taskFilesToFiles),
    createRoute(controller.findAll)
  )
  .post(
    validateDto(CreateTaskFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    jsonInterceptor(taskFileToFile),
    injectParamsForQueryFilter(taskFilesParamsToKey)
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
