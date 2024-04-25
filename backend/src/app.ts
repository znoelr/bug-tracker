import 'reflect-metadata';
import './globals';
import swaggerUi from 'swagger-ui-express';
import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import appRouter from './router/router';
import * as config from './config';
import { httpLogger as appLogger } from './logger';
import { parseSearchForPagination } from './middleware';

const swaggerDocument = require('./swagger.json');

export const bootstrapApp = async (): Promise<Express> => {
  config.init();

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(appLogger);
  // Append pagination
  app.use(parseSearchForPagination());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(appRouter);

  return app;
};
