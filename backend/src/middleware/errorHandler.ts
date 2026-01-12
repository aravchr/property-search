import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Something went wrong',
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({ error: `Not found - ${req.originalUrl}` });
};
