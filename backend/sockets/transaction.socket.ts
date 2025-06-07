import { Namespace } from 'socket.io';
import pumpPortal from '../utils/pumpPortal';
import socketAuthMiddleware from '../middlewares/socketAuth.middleware';
import { Transaction } from '../types';
import { getTokenDetails } from '../services/token.service';
import transactionBot from '../bots/transactionBot';
import { getWalletsOfUser } from '../services/wallet.service';

export default function transactionSocket(namespace: Namespace): void {
  namespace.use(socketAuthMiddleware);

  namespace.on('connection', async (socket) => {
    try {
      const wallets = await getWalletsOfUser(socket.user.id);
      for (const wallet of wallets) {
        socket.join(wallet.address);
      }
    } catch (error) {
        console.error('Error joining user wallets:', error);
    }

    pumpPortal.onMessage(async (transaction: Transaction, telegramChatIds: string[]) => {
      if (!socket.connected) return;
      
      if (!('signature' in transaction && 'traderPublicKey' in transaction && 'txType' in transaction)) {
        return;
      }
      
      const tokenDetails = await getTokenDetails({
        tokenAddress: transaction.mint,
        solanaAmount: transaction.solAmount,
        tokenMarketCapInSolana: transaction.marketCapSol,
        tokenAmount: transaction.tokenAmount,
        currencySymbol: 'USD',
      });

      if (!tokenDetails) {
        console.error(`Failed to fetch token details for transaction: ${transaction.signature}`);
        return;
      }

      namespace.to(transaction.traderPublicKey).emit('transactionUpdate', {
        signature: transaction.signature,
        traderPublicKey: transaction.traderPublicKey,
        txType: transaction.txType,
        pool: transaction.pool,
        ...tokenDetails,
      });

      const sendTelegramMessage = async (chatId: string) => {
        await transactionBot.api.sendMessage(
          chatId,
          `<a href="https://pump.fun/coin/${transaction.mint}">${transaction.txType.toUpperCase()} ${tokenDetails.tokenSymbol}</a>\n\n` +
          `Wallet: ${transaction.traderPublicKey}\n\n` +
          `${transaction.tokenAmount.toFixed(4)} ${tokenDetails.tokenSymbol} ${tokenDetails.tokenTotalValue.toFixed(2)} ${tokenDetails.currencySymbol} for ${tokenDetails.solanaAmount.toFixed(4)} SOL\n\n` +
          `MarketCap: ${tokenDetails.tokenMarketCap.toFixed(2)} ${tokenDetails.currencySymbol}`,
          { parse_mode: 'HTML' }
        );
      };

      await Promise.all(telegramChatIds.map(sendTelegramMessage));
    });

    socket.on('ping', () => {
      namespace.emit('pong', { message: 'Pong!' });
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
        socket.join(walletAddress);
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
        socket.leave(walletAddress);
      },
    );
  });
}
