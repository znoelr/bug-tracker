import { NextFunction} from 'express';
import { TASK_SEVERITY, TASK_TYPES } from '../../task.constants';
import { validateSeverityByType } from '../../middlewares/validate-severity.middleware';
import { BadRequestException } from '../../../../common/exceptions';

let req: any;
let res: any;
let next: NextFunction = jest.fn();

describe('[Validate Severity]', () => {
  beforeEach(() => {
    req = {
      body: {},
      foundRecord: null,
    };
    res = {};
    jest.resetAllMocks();
  });

  it('should pass for new "FEATURE" without "severity"', () => {
    req.body = {
      type: TASK_TYPES.FEATURE,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should ERROR for "FEATURE" with "severity"', () => {
    req.body = {
      type: TASK_TYPES.FEATURE,
      severity: TASK_SEVERITY.HIGH,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(BadRequestException));
  });

  it('should pass for "BUG" with "severity"', () => {
    req.body = {
      type: TASK_TYPES.BUG,
      severity: TASK_SEVERITY.HIGH,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should ERROR for "BUG" without "severity"', () => {
    req.body = {
      type: TASK_TYPES.BUG,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(BadRequestException));
  });

  it('should pass when updating from "FEATURE" to "BUG"', () => {
    req.foundRecord = {
      type: TASK_TYPES.FEATURE,
    };
    req.body = {
      type: TASK_TYPES.BUG,
      severity: TASK_SEVERITY.HIGH,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should ERROR when updating from "FEATURE" to "BUG" without "severity"', () => {
    req.foundRecord = {
      type: TASK_TYPES.FEATURE
    };
    req.body = {
      type: TASK_TYPES.BUG,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(BadRequestException));
  });

  it('should pass when updating from "BUG" to "FEATURE"', () => {
    req.foundRecord = {
      type: TASK_TYPES.BUG,
    };
    req.body = {
      type: TASK_TYPES.FEATURE,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should set "severity" to null when updating from "BUG" to "FEATURE"', () => {
    req.foundRecord = {
      type: TASK_TYPES.BUG,
    };
    req.body = {
      type: TASK_TYPES.FEATURE,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.body.severity).toBe(null);
  });

  it('should ERROR when updating from "BUG" to "FEATURE" with "severity"', () => {
    req.foundRecord = {
      type: TASK_TYPES.BUG,
    };
    req.body = {
      type: TASK_TYPES.FEATURE,
      severity: TASK_SEVERITY.EXTREMELY_HIGH,
    };
    validateSeverityByType(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(BadRequestException));
  });
});
