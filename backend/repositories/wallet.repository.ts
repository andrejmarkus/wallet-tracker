import { prisma } from '../database/prisma';
import { PrismaClient, Wallet as PrismaWallet, UserWallet as PrismaUserWallet } from '../generated/prisma';

export class WalletRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findByAddress(address: string): Promise<PrismaWallet | null> {
    return this.prisma.wallet.findUnique({ where: { address } });
  }

  async upsert(address: string): Promise<PrismaWallet> {
    return this.prisma.wallet.upsert({
      where: { address },
      update: {},
      create: { address },
    });
  }

  async findUserWallet(userId: string, address: string): Promise<PrismaUserWallet | null> {
    return this.prisma.userWallet.findUnique({
      where: { userId_walletId: { userId, walletId: address } },
    });
  }

  async createUserWallet(userId: string, address: string, name?: string): Promise<PrismaUserWallet> {
    return this.prisma.userWallet.create({
      data: {
        userId,
        walletId: address,
        name,
      },
    });
  }

  async updateUserWallet(userId: string, address: string, name?: string | null): Promise<PrismaUserWallet> {
    return this.prisma.userWallet.update({
      where: { userId_walletId: { userId, walletId: address } },
      data: { name },
    });
  }

  async deleteUserWallet(userId: string, address: string): Promise<PrismaUserWallet> {
    return this.prisma.userWallet.delete({
      where: { userId_walletId: { userId, walletId: address } },
    });
  }

  async deleteWalletIfNoSubscribers(address: string): Promise<void> {
    const subscribers = await this.prisma.userWallet.count({ where: { walletId: address } });
    if (subscribers === 0) {
      await this.prisma.wallet.delete({ where: { address } });
    }
  }

  async findWalletsByUser(userId: string): Promise<(PrismaWallet & { name: string | null })[]> {
    const userWallets = await this.prisma.userWallet.findMany({
      where: { userId },
      include: { wallet: true },
    });
    return userWallets.map((uw) => ({ ...uw.wallet, name: uw.name }));
  }

  async findAllWithSubscribers(): Promise<any[]> {
    return this.prisma.wallet.findMany({
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });
  }
}

export default new WalletRepository();
