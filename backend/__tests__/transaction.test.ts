import { attachTelegramChatIdToTestUser, deleteTestUser, registerTestUser } from '../utils/testUtils';
import { randomUUID } from 'crypto';
import { Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { setupTestServer, waitFor } from '../utils/socketTestUtils';
import { User } from '../types';

let io: Server;
let serverSocket: ServerSocket;
let clientSocket: ClientSocket;

let uuid: string;
let userWithCookie: { user: User, authCookie: string };
let walletAddress: string;

beforeAll(async () => {
    uuid = randomUUID();
    userWithCookie = await registerTestUser(uuid);
    await attachTelegramChatIdToTestUser(userWithCookie.user);
    walletAddress = "ZG98FUCjb8mJ824Gbs6RsgVmr1FhXb2oNiJHa2dwmPd";

    const response = await setupTestServer(userWithCookie.authCookie);
    io = response.io;
    clientSocket = response.clientSocket;
    serverSocket = response.serverSocket;
});

afterAll(async () => {
  await deleteTestUser(userWithCookie.user);
  io.close();
  clientSocket.close();
});

describe('Transaction Socket', () => {
    it('should be connected', async () => {
        clientSocket.emit('ping');
        const response = await waitFor(clientSocket, 'pong');

        expect(response).toBeDefined();
    });

    it('should subscribe to a wallet', async () => {
        clientSocket.emit('subscribeWallet', {
            userId: userWithCookie.user.id,
            walletAddress,
        });

        const response = await waitFor(clientSocket, 'walletSubscribed');

        expect(response).toBeDefined();
        expect(response.userId).toBe(userWithCookie.user.id);
        expect(response.walletAddress).toBe(walletAddress);
    });

    it('should receive transaction updates', async () => {
        console.log('Emitting mock transaction update...');
        const mockTransaction = {
            signature: 'mockSignature123',
            traderPublicKey: 'mockTraderPublicKey123',
            txType: 'buy',
            pool: 'mockPool123',
            mint: 'mockMint123',
            solAmount: 1.23,
            tokenAmount: 100,
            marketCapSol: 1000000,
            tokenName: 'MockToken',
            tokenSymbol: 'MTK',
            tokenMarketCap: 5000000,
            currencySymbol: 'USD',
        };
        serverSocket.emit('transactionUpdate', mockTransaction);

        const response = await waitFor(clientSocket, 'transactionUpdate');

        expect(response).toBeDefined();
        expect(response.signature).toBe(mockTransaction.signature);
    });

    it('should unsubscribe from a wallet', async () => {
        clientSocket.emit('unsubscribeWallet', {
            userId: userWithCookie.user.id,
            walletAddress,
        });

        const response = await waitFor(clientSocket, 'walletUnsubscribed');

        expect(response).toBeDefined();
        expect(response.userId).toBe(userWithCookie.user.id);
        expect(response.walletAddress).toBe(walletAddress);
    });
});