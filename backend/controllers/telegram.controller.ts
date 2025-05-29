import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { generateTelegramToken } from '../services/telegram.service';

export const telegramToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const telegramLinkToken = await generateTelegramToken(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Telegram token generated successfully',
      data: { ...telegramLinkToken },
    });
  } catch (error) {
    next(error);
  }
};
