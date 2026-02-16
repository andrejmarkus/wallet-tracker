import { Router } from 'express'
import { telegramToken, unlinkTelegramAccount } from '../controllers/telegram.controller'
import passport from 'passport'

const telegramRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Telegram
 *   description: Telegram integration and account linking
 */

/**
 * @swagger
 * /telegram/generate-token:
 *   get:
 *     summary: Generate a linking token for the Telegram bot
 *     tags: [Telegram]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Linking token generated
 */
telegramRouter.get(
  '/generate-token',
  passport.authenticate('jwt', { session: false }),
  telegramToken
)

/**
 * @swagger
 * /telegram/unlink:
 *   post:
 *     summary: Unlink the user's Telegram account
 *     tags: [Telegram]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account unlinked
 */
telegramRouter.post(
  '/unlink',
  passport.authenticate('jwt', { session: false }),
  unlinkTelegramAccount
)

export default telegramRouter

