import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { HTTP_BAD_REQUEST } from "../common/http-status-codes";

const parseValidationErrorMesages = (errors: any[]): any => {
  return errors.reduce((acc: {[key: string]: any}, error: {[key: string]: any}) => {
    acc[error.property] = Object.values(error.constraints);
    return acc;
  }, {});
}

export const validateDto = (classDto: {new(): any}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data: {[key: string]: any} = req.body;
    const instance = plainToInstance(classDto, data);
    try {
      await validateOrReject(instance, {
        whitelist: true,
        validationError: { target: false },
      });
      req.body = JSON.parse(JSON.stringify(instance));
      next();
    }
    catch (errors: any) {
      res.status(HTTP_BAD_REQUEST)
        .json(parseValidationErrorMesages(errors));
    }
  };
