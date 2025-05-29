import { User, UserLogin, UserRegister } from '../types';
import { DatabaseOperationError, InvalidCredentialsError, UserAlreadyExistsError } from '../errors';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from '../config/env';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma';
import bcrypt from 'bcryptjs';

export async function loginUser({ username, password }: UserLogin): Promise<User> {
  let user;

  try {
    user = await prisma.user.findUnique({
      where: { username },
    });
  } catch {
    throw new DatabaseOperationError();
  }

  if (!user) throw new InvalidCredentialsError();

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) throw new InvalidCredentialsError();

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    telegramChatId: user.telegramChatId,
  };
}

export async function registerUser({ username, password, email }: UserRegister): Promise<User> {
  let existingUser;

  try {
    existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  } catch {
    throw new DatabaseOperationError();
  }

  if (existingUser) throw new UserAlreadyExistsError();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    telegramChatId: user.telegramChatId,
  };
}

export function generateJwtToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateJwtRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}