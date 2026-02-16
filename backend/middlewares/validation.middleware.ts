import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponseBuilder } from '../utils/apiResponse';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json(ApiResponseBuilder.fail('Validation failed', error.errors));
      }
      next(error);
    }
  };
};
