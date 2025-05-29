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
        if (!socket.user.telegramChatId) return;
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

        await transactionBot.api.sendMessage(
          socket.user.telegramChatId,
          `New transaction detected:\n` +
            `Signature: ${transaction.signature}\n` +
            `Trader: ${transaction.traderPublicKey}\n` +
            `Type: ${transaction.txType}\n` +
            `Pool: ${transaction.pool}\n` +
            `Token: ${tokenDetails.tokenName} (${tokenDetails.tokenSymbol})\n` +
            `Amount: ${tokenDetails.tokenAmount} (${tokenDetails.solanaAmount} SOL)\n` +
            `Market Cap: ${tokenDetails.tokenMarketCap} ${tokenDetails.currencySymbol}`,
        );

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
        if (!socket.user.telegramChatId) return;
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
