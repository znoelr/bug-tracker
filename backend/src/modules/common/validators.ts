import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { HTTP_BAD_REQUEST } from "../common/http-status-codes";
import { v4 as uuid } from 'uuid';
import { ClassConstructor } from "./types";

const parseValidationErrorMesages = (errors: any[]): any => {
  return errors.reduce((acc: {[key: string]: any}, error: {[key: string]: any}) => {
    acc[error.property] = Object.values(error.constraints);
    return acc;
  }, {});
}

const validateDtoFor = (classDto: ClassConstructor, {appendId = true} = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      res.status(HTTP_BAD_REQUEST).end('Must provide some data');
      return;
    }
    const data: {[key: string]: any} = req.body;
    const instance = plainToInstance(classDto, data);
    try {
      await validateOrReject(instance, {
        whitelist: true,
        validationError: { target: false },
      });
      if (appendId) {
        instance.id = uuid();
      }
      req.body = JSON.parse(JSON.stringify(instance));
      next();
    }
    catch (errors: any) {
      res.status(HTTP_BAD_REQUEST)
        .json(parseValidationErrorMesages(errors));
    }
  }
;

export const validateDto = (classDto: ClassConstructor) => validateDtoFor(classDto, { appendId: false });
export const validateDtoAndInjectId = (classDto: ClassConstructor) => validateDtoFor(classDto, { appendId: true });
