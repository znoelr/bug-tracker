import express from "express";
import controller from './project.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto } from "../common/validators";
import { CreateProjectDto } from "./dtos/create-project.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDto(CreateProjectDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));

export const projectRouteConfig: RouteConfig = {
  path: '/projects',
  router,
};
