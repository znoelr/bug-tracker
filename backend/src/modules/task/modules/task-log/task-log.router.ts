import express from "express";
import controller from './task-log.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDtoAndInjectId } from "../../../common/validators";
import { CreateTaskLogDto } from "./dtos/create-task-log.dto";
import { injectQueryFiltersfromRequest } from "../../../middleware";
import { trimObjectForKeys } from "../../../transformers";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED FOR '/:taskId' PREFIX */

router.route('/')
  .all(
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId'])
    )
  )
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateTaskLogDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(
    injectQueryFiltersfromRequest('params')(
      trimObjectForKeys(['taskId', 'id'])
    )
  )
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
