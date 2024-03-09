import express from "express";
import controller from './project-files.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";
import { createComposedKeyFromParams, toEntityForKey, toEntityListForKey, trimExistingParamsForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:projectId' */

router.use(injectQueryOptions(
  new QueryOptions().setInclude({ file: true })
));

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['projectId'])
    )
  )
  .get(
    jsonInterceptor(toEntityListForKey('file')),
    createRoute(controller.findAll)
  )
  .post(
    validateDtoAndInjectId(CreateProjectFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    injectParamsForQueryFilter(
      createComposedKeyFromParams(['projectId', 'fileId'])
    ),
    jsonInterceptor(toEntityForKey('file'))
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
