import express, { Express } from "express";
import appRouter from './router';

const app: Express = express();

app.use(appRouter);

export default app;
