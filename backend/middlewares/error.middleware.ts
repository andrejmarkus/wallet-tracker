import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ServiceError } from '../errors';
import { NODE_ENV } from '../config/env';
import { ApiResponseBuilder } from '../utils/apiResponse';
import logger from '../utils/logger';

const errorMiddleware: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ServiceError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.path} >> ${statusCode} - ${message}`);

  if (NODE_ENV === 'development' && statusCode === 500) {
    logger.error(err.stack);
  }

  res.status(statusCode).json(ApiResponseBuilder.error(message, err.stack));
};

export default errorMiddleware;
