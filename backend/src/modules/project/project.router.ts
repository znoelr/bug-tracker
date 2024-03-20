import express from "express";
import controller from './project.controller';
import { RouteConfig } from "../common/types";
import { routeFactory } from "../common/route-handlers";
import { validateDto, validateDtoAndInjectId } from "../common/validators";
import { CreateProjectDto } from "./dtos/create-project.dto";
import {
  findResourceByRequestQueryFilters,
  injectQueryFiltersfromRequest,
  parseParamsForQueryFilter,
  parseUrlQueryForQueryOptionsSelect,
  parseUrlQueryForQueryOptionsSortBy,
  validateUniqueKeysFromRequest,
} from "../middleware";
import projectFilesRouter from './modules/project-files/project-files.router';
import { ProjectDto } from "./dtos/project.dto";
import { projectService } from "./project.service";
import { trimObjectForKeys } from "../transformers";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { ProjectSortDto } from "./dtos/project-sort.dto";
import { restrictTo } from "../auth/middlewares/restrict-to.middleware";
import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "../permission/permission.constants";

const router = express.Router();
const createRoute = routeFactory(controller);

router.use(
  parseUrlQueryForQueryOptionsSelect(ProjectDto)
);

router.route('/')
  .get(
    restrictTo(PERMISSION_ACTION.LIST, PERMISSION_RESOURCE.PROJECT),
    parseUrlQueryForQueryOptionsSortBy(ProjectSortDto),
    createRoute(controller.findAll)
  )
  .post(
    restrictTo(PERMISSION_ACTION.CREATE, PERMISSION_RESOURCE.PROJECT),
    validateDtoAndInjectId(CreateProjectDto),
    validateUniqueKeysFromRequest('body')(projectService, ['title']),
    createRoute(controller.create)
  );

router.route('/:id')
  .all(parseParamsForQueryFilter())
  .get(
    restrictTo(PERMISSION_ACTION.GET, PERMISSION_RESOURCE.PROJECT),
    createRoute(controller.findById)
  )
  .patch(
    restrictTo(PERMISSION_ACTION.UPDATE, PERMISSION_RESOURCE.PROJECT),
    validateDto(UpdateProjectDto),
    validateUniqueKeysFromRequest('body')(projectService, ['title']),
    createRoute(controller.update)
  )
  .delete(
    restrictTo(PERMISSION_ACTION.DELETE, PERMISSION_RESOURCE.PROJECT),
    createRoute(controller.delete)
  );


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
