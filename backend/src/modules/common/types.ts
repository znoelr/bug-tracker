import express, { NextFunction, Request, Response } from "express";

export type RouteConfig = {
  path: string;
  router: express.Router;
};

export type RequestHandlerFn = (req: Request, res: Response, next: NextFunction) => void;

export interface Pagination {
  nextId?: string;
  limit?: number;
}

export interface QueryFilters {
  where?: { [key: string]: any };
  or?: {[key: string]: any}[];
}

export interface QueryOptions {
  select?: {[key: string]: any};
}
