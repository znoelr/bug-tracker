import express from "express";
import controller from './task-log.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { CreateTaskLogDto } from "./dtos/create-task-log.dto";
import { injectParamsForQueryFilter } from "../../../middleware";
import { trimExistingParamsForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED FOR '/:taskId' PREFIX */

router.route('/')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId'])
    )
  )
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateTaskLogDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(
    injectParamsForQueryFilter(
      trimExistingParamsForKeys(['taskId', 'id'])
    )
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
