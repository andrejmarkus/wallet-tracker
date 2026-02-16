import { prisma } from '../database/prisma';
import { PrismaClient, TelegramLinkToken as PrismaTelegramLinkToken } from '../generated/prisma';

export class TelegramRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async createToken(userId: string, token: string, expiresAt: Date): Promise<PrismaTelegramLinkToken> {
    return this.prisma.telegramLinkToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findToken(token: string): Promise<PrismaTelegramLinkToken | null> {
    return this.prisma.telegramLinkToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteToken(id: string): Promise<PrismaTelegramLinkToken> {
    return this.prisma.telegramLinkToken.delete({ where: { id } });
  }

  async deleteTokensByUserId(userId: string): Promise<any> {
    return this.prisma.telegramLinkToken.deleteMany({ where: { userId } });
  }

  async updateTelegramChatId(userId: string, telegramChatId: string | null): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { telegramChatId },
    });
  }
}

export default new TelegramRepository();
