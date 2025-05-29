import { SocketType } from 'dgram';

declare module 'socket.io' {
  interface Socket extends SocketType {
    user: {
      id: string;
      email: string;
      username: string;
      telegramChatId?: string | null;
    };
  }
}
