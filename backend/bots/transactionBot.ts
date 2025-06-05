import { Bot } from 'grammy'
import { TELEGRAM_BOT_TOKEN } from '../config/env'
import prisma from '../database/prisma'
import { getUserByTelegramChatId } from '../services/user.service'
import { walletSchema } from '../schemas'
import { createWalletForUser, deleteWalletForUser, getWalletsOfUser } from '../services/wallet.service'
import { UserNotFoundError, WalletNotFoundError } from '../errors'
import pumpPortal from '../utils/pumpPortal'

const transactionBot = new Bot(TELEGRAM_BOT_TOKEN)

export async function initializeTransactionBot() {
  await transactionBot.api.setMyCommands([
    { command: 'help', description: 'Get help with using the bot' },
    { command: 'start', description: 'Link your Telegram account' },
    { command: 'add', description: 'Add a Solana wallet to your account' },
    { command: 'remove', description: 'Remove a Solana wallet from your account' },
    { command: 'wallets', description: 'List all linked Solana wallets' }
  ])
}

transactionBot.command('help', ctx => {
  ctx.reply(
    'Welcome to the Transaction Bot!\n\n' +
    'Here are the commands you can use:\n' +
    '/start <link_token> - Link your Telegram account using link token\n' +
    '/add <wallet_address> - Add a Solana wallet to your account\n' +
    '/remove <wallet_address> - Remove a Solana wallet from your account\n' +
    '/wallets - List all linked Solana wallets\n\n' +
    'Make sure to link your Telegram account first using /start.'
  )
})

transactionBot.command('start', async ctx => {
  const token = ctx.match
  if (!token) {
    ctx.reply('Please provide a valid token to link your Telegram account.')
    return
  }

  const telegramLinkToken = await prisma.telegramLinkToken.findUnique({
    where: { token }
  })

  if (!telegramLinkToken || telegramLinkToken.expiresAt < new Date()) {
    ctx.reply('Invalid or expired token. Please try again.')
    return
  }

  try {
    await prisma.telegramLinkToken.delete({
      where: { token }
    })

    const user = await prisma.user.update({
      where: { id: telegramLinkToken.userId },
      data: { telegramChatId: ctx.chatId.toString() }
    })

    ctx.reply(
      `Your Telegram account has been successfully linked, ${user.username || user.email}!`
    )
  } catch (error) {
    console.error('Error linking Telegram account:', error)
    ctx.reply(
      'An error occurred while linking your account. Please try again later.'
    )
  }
})

transactionBot.command('add', async ctx => {
    try {
      const user = await getUserByTelegramChatId(ctx.chatId.toString());
      const address = ctx.match;
      if (address.length == 0) {
        ctx.reply('You need to provide a Solana wallet address to add. Please use the command like this: /add <wallet_address>');
        return;
      }
      const result = walletSchema.safeParse({ address });
      if (!result.success) {
        ctx.reply('Invalid Solana wallet address. Please provide a valid address.');
        return;
      }
      await createWalletForUser(result.data.address, user.id);
      pumpPortal.subscribeWallet(user.id, result.data.address);
      ctx.reply(`Wallet ${result.data.address} has been added successfully!`);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        ctx.reply('You need to link your Telegram account first using the /start command.');
      } else {
        ctx.reply('An error occurred while adding the wallet. Please try again later.');
      }
    }
})

transactionBot.command('remove', async ctx => {
  try {
    const user = await getUserByTelegramChatId(ctx.chatId.toString());
    const address = ctx.match;
    if (address.length == 0) {
      ctx.reply('You need to provide a Solana wallet address to remove. Please use the command like this: /remove <wallet_address>');
      return;
    }
    const result = walletSchema.safeParse({ address });
    if (!result.success) {
      ctx.reply('Invalid Solana wallet address. Please provide a valid address.');
      return;
    }
    await deleteWalletForUser(result.data.address, user.id);
    pumpPortal.unsubscribeWallet(user.id, result.data.address);
    ctx.reply(`Wallet ${result.data.address} has been removed successfully!`);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      ctx.reply('You need to link your Telegram account first using the /start command.');
    } else if (error instanceof WalletNotFoundError) {
      ctx.reply('The specified wallet does not exist or is not linked to your account.');
    } else {
      ctx.reply('An error occurred while removing the wallet. Please try again later.');
    }
  }
})

transactionBot.command('wallets', async ctx => {
  try {
    const user = await getUserByTelegramChatId(ctx.chatId.toString());
    const wallets = await getWalletsOfUser(user.id);

    if (wallets.length === 0) {
      ctx.reply("You don't have any linked wallets to your account.");
      return;
    }

    const walletList = wallets.map(wallet => wallet.address).join('\n');
    ctx.reply(`Your linked wallets:\n${walletList}`);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      ctx.reply('You need to link your Telegram account first using the /start command.');
    } else {
      ctx.reply('An error occurred while fetching your wallets. Please try again later.');
    }
  }
})

export default transactionBot
