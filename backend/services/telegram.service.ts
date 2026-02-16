import { randomUUID } from 'node:crypto';
import { DatabaseOperationError } from '../errors';
import { TelegramToken } from '../types';
import telegramRepository from '../repositories/telegram.repository';

export async function generateTelegramToken(userId: string): Promise<TelegramToken> {
  try {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const telegramLinkToken = await telegramRepository.createToken(userId, token, expiresAt);

    return {
      token: telegramLinkToken.token,
      expiresAt: telegramLinkToken.expiresAt.toISOString(),
    };
  } catch {
    throw new DatabaseOperationError();
  }
}

export async function unlinkTelegram(userId: string): Promise<void> {
  try {
    await telegramRepository.deleteTokensByUserId(userId);
    await telegramRepository.updateTelegramChatId(userId, null);
  } catch {
    throw new DatabaseOperationError();
  }
}
