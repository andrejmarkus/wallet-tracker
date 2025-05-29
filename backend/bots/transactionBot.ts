import { Bot } from 'grammy'
import { TELEGRAM_BOT_TOKEN } from '../config/env'
import prisma from '../database/prisma'

const transactionBot = new Bot(TELEGRAM_BOT_TOKEN)

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
      data: { telegramChatId: ctx.chat.id.toString() }
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

export default transactionBot
