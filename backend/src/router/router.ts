import express, { NextFunction, Request, Response } from "express";
import routerList from './router-list';
import { RouteConfig } from "../modules/common/types";
import { NotFoundException } from "../modules/common/exceptions";
import { fileLogger } from '../logger';

const logger = fileLogger();
const router = express.Router();

const registerRoute = (routeConfig: RouteConfig) => {
  const {path, router: _router} = routeConfig;
  router.use(path, _router);
}

// Register Routes
routerList.forEach(registerRoute);

// Error 404
router.use('*', (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).end('[404] Not found');
});

// Error 500
router.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof NotFoundException) {
    res.status(404).end(err.message || 'Not found');
    return;
  }
  try {
    // Append to error log file
    logger.error(`${err}`);
  }
  finally {
    res.status(500).end('Something went wrong');
  }
});

export default router;
