import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ServiceError } from '../errors';
import { NODE_ENV } from '../config/env';

const errorMiddleware: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ServiceError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: message,
    error: NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;
