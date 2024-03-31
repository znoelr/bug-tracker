import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../common/exception-handlers";
import { TASK_TYPES } from "../task.constants";
import { BadRequestException } from "../../../common/exceptions";

export const validateSeverityByType = catchAsync((req: Request, res: Response, next: NextFunction) => {
  const toSaveAsFeature = req.body.type === TASK_TYPES.FEATURE;
  const isFeature = req.foundRecord?.type === TASK_TYPES.FEATURE;
  const toSaveAsBug = req.body.type === TASK_TYPES.BUG;
  const hasSeveritySet = !!req.foundRecord?.severity;
  const isSettingSeverity = !!req.body.severity;

  if (toSaveAsBug && !hasSeveritySet && !isSettingSeverity) { // Require "severity"
    next(new BadRequestException(`"severity" should be provided for task of type ${TASK_TYPES.BUG}`));
    return;
  }
  if (
    (toSaveAsFeature && isSettingSeverity) ||
    (isFeature && isSettingSeverity && !toSaveAsBug)
  ) { // should not provide "severity"
    next(new BadRequestException(`"severity" should NOT be provided for task of type ${TASK_TYPES.FEATURE}`));
    return;
  }
  if (toSaveAsFeature) {
    req.body.severity = null;
  }
  next();
});
