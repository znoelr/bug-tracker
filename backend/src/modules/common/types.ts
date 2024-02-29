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
  where?: {
    [key: string]: any;
    OR?: {[key: string]: any}[];
    NOT?: {[key: string]: any}[];
    AND?: {[key: string]: any}[];
  };
}

export interface QueryOptions {
  select?: { [key: string]: any; };
  include?: { [key: string]: any; };
  orderBy?: { [key: string]: 'asc'|'desc' };
}
