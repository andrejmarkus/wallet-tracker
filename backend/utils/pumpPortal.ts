import WebSocket from 'ws';
import { Transaction } from '../types';
import walletRepository from '../repositories/wallet.repository';
import userRepository from '../repositories/user.repository';
import logger from './logger';

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
      logger.info('[PumpPortal] WebSocket already initialized');
      return;
    }
    logger.info('[PumpPortal] Initializing WebSocket connection to Pump Portal');

    this.ws = new WebSocket('wss://pumpportal.fun/api/data');

    this.ws.on('open', async () => {
      logger.info('[PumpPortal] Connected to Pump Portal WebSocket');
      
      const wallets = await walletRepository.findAllWithSubscribers();

      wallets.forEach(wallet => {
        const walletAddress = wallet.address;
        const subscribers = new Set<string>(wallet.users.map((user: any) => user.userId));
        if (subscribers.size > 0) {
          walletSubscriptions.set(walletAddress, subscribers);
          logger.debug(`[PumpPortal] Subscribed to wallet ${walletAddress} with ${subscribers.size} users`);
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
          logger.debug(`[PumpPortal] Resubscribed to wallet ${walletId}`);
        }
      });
    });
  },
  onMessage(callback: (transaction: Transaction, telegramChatIds: string[]) => void) {
    if (!this.ws) this.init();
    if (!this.ws) return;

    this.ws.on('message', async (message: string) => {
      const data = JSON.parse(message.toString());
      const tx = data as Transaction;

      if (!tx.traderPublicKey) return; // Ignore non-trade messages or errors

      const userIdsSet = walletSubscriptions.get(tx.traderPublicKey);
      if (!userIdsSet) return;
      
      const userIds = new Set(userIdsSet);
      const users = await userRepository.findAll(); // Simple approach, or add a findManyByIds
      const telegramChatIds = users
        .filter(u => userIds.has(u.id))
        .map(user => user.telegramChatId)
        .filter((id): id is string => id !== null);

      callback(tx, telegramChatIds);
    });
  },
  subscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      logger.warn(`[PumpPortal] Queued subscribe for wallet ${walletId}`);
      return;
    }
    this._doSubscribe(userId, walletId);
  },
  unsubscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      logger.warn(`[PumpPortal] Queued unsubscribe for wallet ${walletId}`);
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
