import request from 'supertest';
import app from '../app';
import { deleteTestUser, registerTestUser } from '../utils/testUtils';
import { randomUUID } from 'crypto';
import { User, Wallet } from '../types';
import { walletSchema } from '../schemas';

const wallet = "ZG98FUCjb8mJ824Gbs6RsgVmr1FhXb2oNiJHa2dwmPd";

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
    it('should create a new wallet for authorized user', async () => {
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

    it('should get all wallets of authorized user', async () => {
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

    it('should delete a wallet of authorized user', async () => {
        const response = await request(app)
            .delete(`/api/v1/wallets/${wallet}`)
            .set('Cookie', userWithCookie.authCookie);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Wallet deleted successfully');
    });

    it('should have no wallets after deletion', async () => {
        const response = await request(app)
            .get('/api/v1/wallets')
            .set('Cookie', userWithCookie.authCookie);

        expect(response.status).toBe(200);
        expect(response.body.data.wallets).toEqual([]);
    });

    it('should return 404 for non-existent wallet deletion', async () => {
        const nonExistentWallet = "254RB8oNnV2sGphrjgggwNWTk97LbP82RJXneSmejqSh";
        const response = await request(app)
            .delete(`/api/v1/wallets/${nonExistentWallet}`)
            .set('Cookie', userWithCookie.authCookie);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Wallet not found');
    });

    it('should return 401 for unauthorized wallet creation', async () => {
        const newWallet = { address: wallet };
        const response = await request(app)
            .post('/api/v1/wallets')
            .send(newWallet);
        
        expect(response.status).toBe(401);
    });

    it('should return 400 for invalid wallet creation request', async () => {
        const invalidWallet = { address: "0x98FUCjb8mJ824Gbs6RsgVmr1FhXb2oNiJHa2dwmPd" };
        const response = await request(app)
            .post('/api/v1/wallets')
            .set('Cookie', userWithCookie.authCookie)
            .send(invalidWallet);
        
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Non-base58 character');
    });

    it('should return 401 for getting wallets of unauthorized user', async () => {
        const response = await request(app)
            .get('/api/v1/wallets/authorized')

        expect(response.status).toBe(401);
    });
})