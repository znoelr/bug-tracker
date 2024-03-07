import 'reflect-metadata';
import './globals';
import express, { Express } from "express";
import appRouter from './router/router';
import * as config from './config';
import { httpLogger as appLogger } from './logger';
import { injectQueryOptions, parseSearchForPagination } from './modules/middleware';

config.init();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLogger());
// Append pagination
app.use(parseSearchForPagination());
// Append Query Options
app.use(injectQueryOptions());
app.use(appRouter);

export default app;
