import { Socket } from 'socket.io';
import { JwtPayload, verify } from 'jsonwebtoken';
import prisma from '../database/prisma';
import { JWT_SECRET } from '../config/env';

export default async function socketAuthMiddleware(
  socket: Socket,
  next: (error?: Error) => void,
): Promise<void> {
  try {
    const cookie = socket.handshake.headers.cookie;
    const token = cookie?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return next(new Error('Authentication error: Unauthorized'));
    }

    const decoded = verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new Error('Authentication error: Unauthorized'));
    }

    socket.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      telegramChatId: user.telegramChatId,
    };

    next();
  } catch {
    next(new Error('Authentication error: Unauthorized'));
  }
}
