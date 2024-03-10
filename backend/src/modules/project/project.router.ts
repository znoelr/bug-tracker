import express from "express";
import controller from './project.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDtoAndInjectId } from "../common/validators";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { findResourceByRequestQueryFilters, injectQueryFiltersfromParams, parseParamsForQueryFilter } from "../middleware";
import projectFilesRouter from './modules/project-files/project-files.router';
import { ProjectDto } from "./dtos/project.dto";
import { projectService } from "./project.service";
import { trimExistingParamsForKeys } from "../transformers";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateProjectDto),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(createRoute(controller.update))
  .delete(createRoute(controller.delete));


/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:projectId/*',
  injectQueryFiltersfromParams(
    trimExistingParamsForKeys(['projectId:id'])
  ),
  findResourceByRequestQueryFilters<ProjectDto>(projectService),
);

/** Nested project files */
router.use(`/:projectId/files`, projectFilesRouter);

export const projectRouteConfig: RouteConfig = {
  path: '/projects',
  router,
};
