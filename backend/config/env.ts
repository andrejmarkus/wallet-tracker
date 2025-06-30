import { config } from 'dotenv';
import ms from 'ms';

config({ path: `.env.${process.env.NODE_ENV}`, debug: process.env.NODE_ENV === 'development' });

interface EnvVariables {
  PORT: number;
  HOST: string;
  NODE_ENV: string;
  ORIGIN_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: ms.StringValue;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: ms.StringValue;
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
}

export const {
  PORT,
  HOST,
  NODE_ENV,
  ORIGIN_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  DATABASE_URL,
  TELEGRAM_BOT_TOKEN,
} = process.env as unknown as EnvVariables;
