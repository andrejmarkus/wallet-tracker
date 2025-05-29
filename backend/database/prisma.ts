import { NODE_ENV } from '../config/env';
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
