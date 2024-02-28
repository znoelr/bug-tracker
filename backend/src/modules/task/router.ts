import express from "express";
import controller from './controller';
import { RouteConfig } from "../common/types";

const router = express.Router();

router.get('/:id', controller.findById);
router.get('/', controller.findAll);

const routeConfig: RouteConfig = {
  path: '/tasks',
  router,
};

export default routeConfig;
