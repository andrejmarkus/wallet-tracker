import { NextFunction, Request, Response } from 'express';
import { tokenRequestSchema } from '../schemas';
import { InvalidRequestError } from '../errors';
import { getTokenDetails } from '../services/token.service';

export const tokenDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenRequest = tokenRequestSchema.safeParse(req.body);

    if (!tokenRequest.success) throw new InvalidRequestError();

    const tokenDetails = await getTokenDetails(tokenRequest.data);

    res.status(200).json({
      status: 'success',
      message: 'Token details fetched successfully',
      data: tokenDetails,
    });
  } catch (error) {
    next(error);
  }
};
