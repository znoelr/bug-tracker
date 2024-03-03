import express, { Express } from "express";
import appRouter from './router';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appRouter);

export default app;
