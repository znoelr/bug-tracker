import { NextFunction, Request, Response } from 'express';
import pinoLogger from 'pino-http';

const logger = pinoLogger({
  transport: {
    target: 'pino-pretty',
    options: {
      singleLine: true,
    },
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (res.statusCode >= 300) return 'silent';
    return 'info';
  },
});

const emptyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export const httpLogger = () => process.env.NODE_ENV !== 'test'
  ? logger
  : emptyMiddleware;
