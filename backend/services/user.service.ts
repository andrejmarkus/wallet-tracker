import prisma from '../database/prisma';
import { DatabaseOperationError, UserNotFoundError } from '../errors';
import { User } from '../types';

export async function getUsers(): Promise<User[]> {
  let users;

  try {
    users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        telegramChatId: true,
      },
    });
  } catch {
    throw new DatabaseOperationError();
  }

  return users;
}

export async function getUserById(id: string): Promise<User> {
  let user;

  try {
    user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        telegramChatId: true,
      },
    });
  } catch {
    throw new DatabaseOperationError();
  }

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}
