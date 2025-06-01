import { Router } from 'express'

import { telegramToken, unlinkTelegramAccount } from '../controllers/telegram.controller'
import passport from 'passport'

const telegramRouter = Router()

telegramRouter.get(
  '/generate-token',
  passport.authenticate('jwt', { session: false }),
  telegramToken
)
telegramRouter.post(
  '/unlink',
  passport.authenticate('jwt', { session: false }),
  unlinkTelegramAccount
)

export default telegramRouter
