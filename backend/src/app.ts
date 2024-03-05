import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import express, { Express } from "express";
import appRouter from './router/router';

const dotenvFileName = `.env${(process.env.APP_ENV && '.' + process.env.APP_ENV) || ''}`;
dotenv.config({
  path: path.resolve(process.cwd(), dotenvFileName),
});

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appRouter);

export default app;
