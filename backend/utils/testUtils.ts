import request from 'supertest';
import app from '../app';
import prisma from '../database/prisma';
import { User } from '../types';

export const registerTestUser = async (uuid: string): Promise<{ user: User, authCookie: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: `johndoe-${uuid}@mail.hl`,
    },
  });
  if (existingUser) await deleteTestUser(existingUser);

  const response = await request(app).post('/api/v1/auth/register').send({
    username: `johndoe-${uuid}`,
    password: 'password123',
    email: `johndoe-${uuid}@mail.hl`,
  });

  if (response.status !== 201) {
    console.error('Failed to create test user:', response.body);
    throw new Error('Test user creation failed');
  }

  const user = response.body.data.user;
  if (!user) {
    throw new Error('User data not found in response');
  }
  const authCookie = response.headers['set-cookie'];
  if (!authCookie) {
    throw new Error('Authentication cookie not found in response headers');
  }

  return { user, authCookie };
};

export const attachTelegramChatIdToTestUser = async ({ username, email }: User) => {
  await prisma.user.update({
    where: { username, email },
    data: { telegramChatId: '123456789' }, // Example chat ID
  });
}

export const deleteTestUser = async ({ username, email }: User): Promise<void> => {
  await prisma.user.deleteMany({
    where: { email, username },
  });
};