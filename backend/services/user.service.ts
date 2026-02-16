import userRepository from '../repositories/user.repository';
import { DatabaseOperationError, UserNotFoundError } from '../errors';
import { User } from '../types';

export async function getUsers(): Promise<User[]> {
  try {
    const users = await userRepository.findAll();

    return users.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        telegramChatId: user.telegramChatId,
    }));
  } catch {
    throw new DatabaseOperationError();
  }
}

export async function getUserById(id: string): Promise<User> {
  let user;

  try {
    user = await userRepository.findById(id);
  } catch {
    throw new DatabaseOperationError();
  }

  if (!user) {
    throw new UserNotFoundError();
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    telegramChatId: user.telegramChatId,
  };
}

export async function getUserByTelegramChatId(telegramChatId: string): Promise<User> {
  let user;

  try {
    user = await userRepository.findByTelegramChatId(telegramChatId);
  } catch {
    throw new DatabaseOperationError();
  }

  if (!user) {
    throw new UserNotFoundError();
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    telegramChatId: user.telegramChatId,
  };
}
