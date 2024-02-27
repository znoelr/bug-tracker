import express, { NextFunction, Request, Response } from "express";
import { NotFoundException } from "./modules/common/exceptions";

const router = express.Router();

// Error 404
router.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(404).end('Not found');
});

// Error 500
router.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof NotFoundException) {
    res.status(404).end(err.message || 'Not found');
    return;
  }
  // TODO: Append to logging files
  console.log('Catched error', err);
  res.status(500).end('Something went wrong');
});

export default router;
