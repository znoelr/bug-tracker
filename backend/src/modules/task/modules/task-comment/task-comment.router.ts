import express from "express";
import controller from './task-comment.controller';
import { routeFactory } from "../../../common/route-handlers";
import { RouteConfig } from "../../../common/types";
import { validateDto } from "../../../common/validators";
import { CreateTaskCommentDto } from "./dtos/create-task-comment.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateTaskCommentDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const taskCommentRouteConfig: RouteConfig = {
  path: '/task-comments',
  router,
};
