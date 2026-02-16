import { PrismaClient } from './backend/generated/prisma';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './backend/.env.development' });

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('[DEBUG] Testing DB connection...');
    console.log('[DEBUG] DATABASE_URL:', process.env.DATABASE_URL);
    try {
        const count = await prisma.user.count();
        console.log('[DEBUG] User count:', count);
    } catch (err) {
        console.error('[DEBUG] DB connection failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
