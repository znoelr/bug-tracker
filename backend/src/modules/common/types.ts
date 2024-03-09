import express, { NextFunction, Request, Response } from "express";

export * from './fetch-objects';

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
