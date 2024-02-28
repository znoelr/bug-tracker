import express from "express";
import controller from './controller';
import { RouteConfig } from "../common/types";
import { catchAsync } from "../common/exception-handlers";

const router = express.Router();

router.get('/:id', catchAsync(controller.findById.bind(controller)));
router.get('/', catchAsync(controller.findAll.bind(controller)));

const routeConfig: RouteConfig = {
  path: '/tasks',
  router,
};

export default routeConfig;
