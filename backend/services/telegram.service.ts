import prisma from '../database/prisma';
import { randomUUID } from 'crypto';
import { DatabaseOperationError } from '../errors';
import { TelegramToken } from '../types';

export async function generateTelegramToken(userId: string): Promise<TelegramToken> {
  try {
    const token = randomUUID();

    const telegramLinkToken = await prisma.telegramLinkToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
      },
    });

    return {
      token: telegramLinkToken.token,
      expiresAt: telegramLinkToken.expiresAt.toISOString(),
    };
  } catch {
    throw new DatabaseOperationError();
  }
}
