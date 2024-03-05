import 'reflect-metadata';
import express, { Express } from "express";
import appRouter from './router/router';
import * as config from './config';
import { httpLogger as appLogger } from './logger';

config.init();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLogger());
app.use(appRouter);

export default app;
