import { prisma } from '../database/prisma';
import { PrismaClient, User as PrismaUser } from '../generated/prisma';
import { IBaseRepository } from './base.repository';

export class UserRepository implements IBaseRepository<PrismaUser> {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async create(data: any): Promise<PrismaUser> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any): Promise<PrismaUser> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<PrismaUser> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }

  async findByTelegramChatId(telegramChatId: string): Promise<PrismaUser | null> {
    return this.prisma.user.findFirst({
      where: { telegramChatId },
    });
  }

  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }
}

export default new UserRepository();
