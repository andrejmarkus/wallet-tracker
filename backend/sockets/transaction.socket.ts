import { Namespace } from 'socket.io';
import pumpPortal from '../utils/pumpPortal';
import socketAuthMiddleware from '../middlewares/socketAuth.middleware';
import { Transaction } from '../types';
import { getTokenDetails } from '../services/token.service';
import transactionBot from '../bots/transactionBot';

export default function transactionSocket(namespace: Namespace): void {
  namespace.use(socketAuthMiddleware).on('connection', (socket) => {

    pumpPortal.onMessage(async (message: string) => {
      if (socket.connected) {
        const data = JSON.parse(message.toString());
        const transaction = data as Transaction;
        if (!('signature' in transaction && 'traderPublicKey' in transaction && 'txType' in transaction)) {
          return;
        }
        console.log('New transaction received:', transaction);
        const tokenDetails = await getTokenDetails({
          tokenAddress: transaction.mint,
          solanaAmount: transaction.solAmount,
          tokenMarketCapInSolana: transaction.marketCapSol,
          tokenAmount: transaction.tokenAmount,
          currencySymbol: 'USD',
        });

        const telegramChatId = socket.user.telegramChatId;
        if (telegramChatId) {
          await transactionBot.api.sendMessage(
            telegramChatId,
            `<a href="https://pump.fun/coin/${transaction.mint}">${transaction.txType.toUpperCase()} ${tokenDetails.tokenSymbol}</a>\n\n` +
            `${transaction.tokenAmount.toFixed(4)} ${tokenDetails.tokenSymbol} ${tokenDetails.tokenTotalValue.toFixed(2)} ${tokenDetails.currencySymbol} for ${tokenDetails.solanaAmount.toFixed(4)} SOL\n\n` +
            `MarketCap: ${tokenDetails.tokenMarketCap.toFixed(2)} ${tokenDetails.currencySymbol}`,
            { parse_mode: 'HTML' }
          );
        }

        socket.emit('transactionUpdate', {
          signature: transaction.signature,
          traderPublicKey: transaction.traderPublicKey,
          txType: transaction.txType,
          pool: transaction.pool,
          ...tokenDetails,
        });
      }
    });

    socket.on('ping', () => {
      socket.emit('pong', { message: 'Pong!' });
    });

    socket.on(
      'subscribeWallet',
      ({ userId, walletAddress }: { userId: string; walletAddress: string }) => {
        pumpPortal.subscribeWallet(userId, walletAddress);
        socket.emit('walletSubscribed', {
          userId,
          walletAddress,
          message: `Subscribed to wallet ${walletAddress} for user ${userId}`,
        });
      },
    );

    socket.on(
      'unsubscribeWallet',
      ({ userId, walletAddress }: { userId: string; walletAddress: string }) => {
        pumpPortal.unsubscribeWallet(userId, walletAddress);
        socket.emit('walletUnsubscribed', {
          userId,
          walletAddress,
          message: `Unsubscribed from wallet ${walletAddress} for user ${userId}`,
        });
      },
    );
  });
}
