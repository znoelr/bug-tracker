import 'reflect-metadata';
import './globals';
import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import appRouter from './router/router';
import * as config from './config';
import { httpLogger as appLogger } from './logger';
import { parseSearchForPagination } from './modules/middleware';
import { connectRedis } from './modules/redis';
import { cachePermissionsAccess } from './modules/common/helpers/cache.helpers';
import { connectMongo } from './mongodb';

export const bootstrapApp = async (): Promise<Express> => {
  config.init();

  await connectMongo();
  await connectRedis();
  await cachePermissionsAccess();

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(appLogger());
  // Append pagination
  app.use(parseSearchForPagination());
  app.use(appRouter);

  return app;
};
