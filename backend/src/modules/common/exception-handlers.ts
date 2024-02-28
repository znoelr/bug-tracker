import { NextFunction, Request, Response } from "express";

type GenericFn = (...args: any[]) => void;

export const catchAsync = (fn: GenericFn) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  }
  catch (error) {
    next(error);
  }
};
