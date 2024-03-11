import express from "express";
import controller from './project.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { findResourceByRequestQueryFilters, injectQueryFiltersfromRequest, parseParamsForQueryFilter, validateUniqueKeysFromRequest } from "../middleware";
import projectFilesRouter from './modules/project-files/project-files.router';
import { ProjectDto } from "./dtos/project.dto";
import { projectService } from "./project.service";
import { trimObjectForKeys } from "../transformers";
import { UpdateProjectDto } from "./dtos/update-project.dto";

const router = express.Router();
const createRoute = routeFactory(controller);

router.route('/')
  .get(createRoute(controller.findAll))
  .post(
    validateDtoAndInjectId(CreateProjectDto),
    validateUniqueKeysFromRequest('body')(projectService, ['title']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(createRoute(controller.findById))
  .patch(
    validateDto(UpdateProjectDto),
    validateUniqueKeysFromRequest('body')(projectService, ['title']),
    createRoute(controller.update)
  )
  .delete(createRoute(controller.delete));


/** Middleware to ensure resource exists before accessing nested routes */
router.use(
  '/:projectId/*',
  injectQueryFiltersfromRequest('params')(
    trimObjectForKeys(['projectId:id'])
  ),
  findResourceByRequestQueryFilters<ProjectDto>(projectService),
);

/** Nested project files */
router.use(`/:projectId/files`, projectFilesRouter);

export const projectRouteConfig: RouteConfig = {
  path: '/projects',
  router,
};
