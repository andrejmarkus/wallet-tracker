import WebSocket from 'ws';
import prisma from '../database/prisma';
import { Transaction } from '../types';

interface PumpPortal {
  ws: WebSocket | null;
  get isOpen(): boolean;
  init: () => void;
  close: () => void;
  onMessage: (callback: (transaction: Transaction, telegramChatIds: string[]) => void) => void;
  subscribeWallet: (userId: string, walletId: string) => void;
  unsubscribeWallet: (userId: string, walletId: string) => void;
  _doSubscribe: (userId: string, walletId: string) => void;
  _doUnsubscribe: (userId: string, walletId: string) => void;
}

const walletSubscriptions = new Map<string, Set<string>>();

const pumpPortal: PumpPortal = {
  ws: null,
  get isOpen() {
    return this.ws?.readyState === WebSocket.OPEN;
  },
  init() {
    if (this.ws) {
      console.log('[PumpPortal] WebSocket already initialized');
      return;
    }
    console.log('[PumpPortal] Initializing WebSocket connection to Pump Portal');

    this.ws = new WebSocket('wss://pumpportal.fun/api/data');

    this.ws.on('open', async () => {
      console.log('[PumpPortal] Connected to Pump Portal WebSocket');
      
      const wallets = await prisma.wallet.findMany({
        select: {
          address: true,
          users: {
            select: {
              userId: true,
            },
          }
        },
      });

      wallets.forEach(wallet => {
        const walletAddress = wallet.address;
        const subscribers = new Set(wallet.users.map(user => user.userId));
        if (subscribers.size > 0) {
          walletSubscriptions.set(walletAddress, subscribers);
          console.log(`[PumpPortal] Subscribed to wallet ${walletAddress} with ${subscribers.size} users`);
        }
      });

      walletSubscriptions.forEach((subscribers, walletId) => {
        if (subscribers.size > 0) {
          if (!this.ws) return;
          this.ws.send(
            JSON.stringify({
              method: 'subscribeAccountTrade',
              keys: [walletId],
            }),
          );
          console.log(`[PumpPortal] Resubscribed to wallet ${walletId}`);
        }
      });
    });
  },
  onMessage(callback: (transaction: Transaction, telegramChatIds: string[]) => void) {
    if (!this.ws) this.init();
    if (!this.ws) return;

    this.ws.on('message', async (message: string) => {
      console.log(`[PumpPortal] Received message: ${message}`);
      const data = JSON.parse(message.toString());
      const tx = data as Transaction;

      const userIds = walletSubscriptions.get(tx.traderPublicKey);
      const users = await prisma.user.findMany({
        where: { id: { in: [...userIds ?? []] } },
        select: { telegramChatId: true }
      });
      const telegramChatIds = users.map(user => user.telegramChatId).filter((id): id is string => id !== null);

      callback(tx, telegramChatIds);
    });
  },
  subscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      console.log(`[PumpPortal] Queued subscribe for wallet ${walletId}`);
      return;
    }
    this._doSubscribe(userId, walletId);
  },
  unsubscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      console.log(`[PumpPortal] Queued unsubscribe for wallet ${walletId}`);
      return;
    }
    this._doUnsubscribe(userId, walletId);
  },
  _doSubscribe(userId: string, walletId: string) {
    let subscribers = walletSubscriptions.get(walletId);
    if (!subscribers) {
      subscribers = new Set();
      walletSubscriptions.set(walletId, subscribers);
    }

    if (subscribers.has(userId)) {
      console.log(`[PumpPortal] User with ID "${userId}" already subscribed to wallet ${walletId}`);
      return;
    }

    subscribers.add(userId);
    console.log(`[PumpPortal] User with ID "${userId}" subscribed to wallet ${walletId}`);

    if (this.ws && subscribers.size === 1 && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          method: 'subscribeAccountTrade',
          keys: [walletId],
        }),
      );
      console.log(`[PumpPortal] Subscribed to wallet ${walletId}`);
    }
  },
  _doUnsubscribe(userId: string, walletId: string) {
    const subscribers = walletSubscriptions.get(walletId);
    if (!subscribers?.has(userId)) {
      console.log(`[PumpPortal] User with ID "${userId}" is not subscribed to wallet ${walletId}`);
      return;
    }

    subscribers.delete(userId);
    console.log(`[PumpPortal] User with ID "${userId}" unsubscribed from wallet ${walletId}`);

    if (this.ws && subscribers.size === 0 && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          method: 'unsubscribeAccountTrade',
          keys: [walletId],
        }),
      );
      walletSubscriptions.delete(walletId);
      console.log(`[PumpPortal] Unsubscribed from wallet ${walletId}`);
    }
  },
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      console.log('[PumpPortal] WebSocket connection closed');
    }
  },
};

export default pumpPortal;
