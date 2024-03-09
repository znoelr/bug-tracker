import express from "express";
import controller from './task-files.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CreateTaskFilesDto } from "./dtos/create-task-files.dto";
import { injectComposedKeyIntoParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId'])
    )
  )
  .get(
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateTaskFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    injectParamsForQueryFilter(
      injectComposedKeyIntoParams(['taskId', 'fileId'])
    ),
    jsonInterceptor(toEntityForKey('file'))
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
