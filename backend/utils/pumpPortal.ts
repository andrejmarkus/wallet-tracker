import WebSocket from 'ws';

type PumpPortalAction =
  | { type: 'subscribe'; userId: string; walletId: string }
  | { type: 'unsubscribe'; userId: string; walletId: string };

interface PumpPortal {
  ws: WebSocket | null;
  get isOpen(): boolean;
  init: () => void;
  close: () => void;
  onMessage: (callback: (message: string) => void) => void;
  subscribeWallet: (userId: string, walletId: string) => void;
  unsubscribeWallet: (userId: string, walletId: string) => void;
  _doSubscribe: (userId: string, walletId: string) => void;
  _doUnsubscribe: (userId: string, walletId: string) => void;
}

const walletSubscriptions = new Map<string, Set<string>>();
const actionQueue: PumpPortalAction[] = [];

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

    this.ws.on('open', () => {
      console.log('[PumpPortal] Connected to Pump Portal WebSocket');

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

      while (actionQueue.length > 0) {
        const action = actionQueue.shift();
        if (action) {
          if (action.type === 'subscribe') {
            this._doSubscribe(action.userId, action.walletId);
          } else if (action.type === 'unsubscribe') {
            this._doUnsubscribe(action.userId, action.walletId);
          }
        }
      }
    });
  },
  onMessage(callback: (message: string) => void) {
    if (!this.ws) this.init();
    if (!this.ws) return;

    this.ws.on('message', (message: string) => {
      console.log(`[PumpPortal] Received message: ${message}`);
      callback(message);
    });
  },
  subscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      actionQueue.push({ type: 'subscribe', userId, walletId });
      console.log(`[PumpPortal] Queued subscribe for wallet ${walletId}`);
      return;
    }
    this._doSubscribe(userId, walletId);
  },
  unsubscribeWallet(userId: string, walletId: string) {
    if (!this.ws) this.init();
    if (!this.isOpen) {
      actionQueue.push({ type: 'unsubscribe', userId, walletId });
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
