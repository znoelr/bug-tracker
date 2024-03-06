import express from "express";
import controller from './task-log.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { CreateTaskLogDto } from "./dtos/create-task-log.dto";
import { parseParamsForQueryFilter } from "../../../middleware";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED FOR '/:taskId' PREFIX */

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskLogDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
