import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { generateTelegramToken, unlinkTelegram } from '../services/telegram.service';

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

export const unlinkTelegramAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError();

    await unlinkTelegram(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Telegram account unlinked successfully',
    });
  } catch (error) {
    next(error);
  }
}
