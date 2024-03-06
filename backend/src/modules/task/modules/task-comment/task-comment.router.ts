import express from "express";
import controller from './task-comment.controller';
import { routeFactory } from "../../../common/route-handlers";
import { validateDto } from "../../../common/validators";
import { CreateTaskCommentDto } from "./dtos/create-task-comment.dto";
import { parseParamsForQueryFilter } from "../../../middleware";

const router = express.Router({ mergeParams: true });
const createRoute = routeFactory(controller);

/** ROUTES DEFINED WITH PREFIX '/:taskId' */

router.route('/')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskCommentDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export default router;
