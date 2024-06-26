import express, { NextFunction, Request, Response } from "express";
import { QueryOptions } from "./fetch-objects";

export type RequesOptions = {
  endRequest: boolean;
};

export type GenericFunction = (...args: any[]) => any;

export type RouteConfig = {
  path: string;
  router: express.Router;
};

export type RequestHandlerFn = (req: Request, res: Response, next: NextFunction) => void;

export type FindResourceError = {
  error: Error,
  throwWhenFound: boolean;
};

export type ClassConstructor = { new(): any };

export type CreateMergedKeys = {
  paramKeys?: string[];
  bodyKeys?: string[];
};

export type GenericObject<T> = { [key: string]: T };
export type SortDirection = 'asc' | 'desc';
export type SortObject = GenericObject<SortDirection>;

export type QueryOptionsTransformerCb = (_: QueryOptions) => QueryOptions;
