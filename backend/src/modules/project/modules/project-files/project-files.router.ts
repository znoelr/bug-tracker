import express from "express";
import controller from './project-files.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { injectQueryOptions, injectParamsForQueryFilter, parseParamsForQueryFilter } from "../../../middleware";
import { QueryOptions } from "../../../common/fetch-objects";
import { jsonInterceptor } from "../../../interceptors";
import { projectFileToFile, projectFilesParamsToKey, projectFilesToFiles } from "./transformers";
import { CreateProjectFilesDto } from "./dtos/create-project-files.dto";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:projectId' */

const defaultqueryOptions = new QueryOptions()
  .setInclude({ file: true })

router.use(injectQueryOptions(defaultqueryOptions));

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(
    jsonInterceptor(projectFilesToFiles),
    createRoute(controller.findAll)
  )
  .post(
    validateDto(CreateProjectFilesDto),
    createRoute(controller.create)
  );

router.route('/:fileId')
  .all(
    jsonInterceptor(projectFileToFile),
    injectParamsForQueryFilter(projectFilesParamsToKey)
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
