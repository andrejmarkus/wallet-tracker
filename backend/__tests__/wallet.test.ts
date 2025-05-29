import request from 'supertest';
import app from '../app';
import { deleteTestUser, registerTestUser } from '../utils/testUtils';
import { randomUUID } from 'crypto';
import { User, Wallet } from '../types';
import { walletSchema } from '../schemas';

const wallet = "0x1234567890abcdef1234567890abcdef12345678";

let uuid: string;
let userWithCookie: { user: User; authCookie: string };

beforeAll(async () => {
    uuid = randomUUID();
    userWithCookie = await registerTestUser(uuid);
});

afterAll(async () => {
    await deleteTestUser(userWithCookie.user);
});

describe('Wallet API', () => {
    it('should create a new wallet', async () => {
        const newWallet = { address: wallet };
        const response = await request(app)
            .post('/api/v1/wallets')
            .set('Cookie', userWithCookie.authCookie)
            .send(newWallet);
        
        const result = walletSchema.safeParse(response.body.data.wallet);
        expect(response.status).toBe(201);
        expect(result.success).toBe(true);
    });

    it('should get all wallets', async () => {
        const response = await request(app)
            .get('/api/v1/wallets')
            .set('Cookie', userWithCookie.authCookie);

        const wallets = response.body.data.wallets as Wallet[];
        const result = wallets.every((wallet: Wallet) =>
            walletSchema.safeParse(wallet).success
        );
        expect(response.status).toBe(200);
        expect(result).toBe(true);
    });

    it('should get wallets of authorized user', async () => {
        const response = await request(app)
            .get('/api/v1/wallets/authorized')
            .set('Cookie', userWithCookie.authCookie);

        const wallets = response.body.data.wallets as Wallet[];
        const result = wallets.every((wallet: Wallet) =>
            walletSchema.safeParse(wallet).success
        );
        expect(response.status).toBe(200);
        expect(result).toBe(true);
    });

    it('should delete a wallet by address', async () => {
        const response = await request(app)
            .delete(`/api/v1/wallets/${wallet}`)
            .set('Cookie', userWithCookie.authCookie);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Wallet deleted successfully');
    });
})