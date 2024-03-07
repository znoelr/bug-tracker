import { NextFunction, Request, Response } from "express";
import { GenericFunction } from "../common/types";

export const jsonInterceptor = (transformCb: GenericFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    const json = res.json.bind(res);
    res.json = (data: any) => json(transformCb(data));
    next();
  }
;
