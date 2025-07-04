declare namespace Express {
  interface User {
    id: string;
    email: string;
    username: string;
    telegramChatId?: string | null;
  }
}
