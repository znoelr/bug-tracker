import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { HTTP_BAD_REQUEST } from "./http-status-codes";
import { v4 as uuid } from 'uuid';
import { ClassConstructor } from "./types";
import { catchAsync } from "./exception-handlers";
import { toJsonError } from "../transformers";

const parseValidationErrorMesages = (errors: any[]): any => {
  return errors.reduce((acc: {[key: string]: any}, error: {[key: string]: any}) => {
    acc[error.property] = Object.values(error.constraints);
    return acc;
  }, {});
}

const validateDtoFor = (classDto: ClassConstructor, {appendId = true} = {}) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data: {[key: string]: any} = req.body;
    const instance = plainToInstance(classDto, data);
    try {
      await validateOrReject(instance, {
        whitelist: true,
        validationError: { target: false },
      });
      if (Object.keys(instance).length === 0) {
        res.status(HTTP_BAD_REQUEST).json(
          toJsonError('Must provide data')
        );
        return;
      }
      if (appendId) {
        instance.id = uuid();
      }
      req.body = JSON.parse(JSON.stringify(instance));
      next();
    }
    catch (errors: any) {
      res.status(HTTP_BAD_REQUEST)
        .json(
          toJsonError(parseValidationErrorMesages(errors))
        );
    }
  })
;

export const validateDto = (classDto: ClassConstructor) => validateDtoFor(classDto, { appendId: false });
export const validateDtoAndInjectId = (classDto: ClassConstructor) => validateDtoFor(classDto, { appendId: true });
