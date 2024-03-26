import express, { NextFunction, Request, Response } from "express";
import routerList from './router-list';
import { RouteConfig } from "../common/types";
import { BaseHttpException } from "../common/exceptions";
import { getFileLogger } from '../logger';
import { authRouteConfig } from '../modules/auth/auth.router';
import { authMiddleware } from "../modules/auth/middlewares/auth.middleware";
import { toJsonError } from "../transformers";

const router = express.Router();

// Auth Route
router.use(authRouteConfig.path, authRouteConfig.router);

// Protect routes
router.use(authMiddleware);

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
  if (err instanceof BaseHttpException) {
    res.status(err.http_code).json(
      toJsonError(err.message || 'Not found')
    );
    return;
  }
  try {
    // Append to error log file
    if(process.env.NODE_ENV !== 'test') {
      const logger = getFileLogger();
      logger.error(`${err}`);
    }
  }
  finally {
    res.status(500).json(
      toJsonError('Something went wrong')
    );
  }
});

export default router;
