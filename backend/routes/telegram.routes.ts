import { Router } from 'express'

import { telegramToken } from '../controllers/telegram.controller'
import passport from 'passport'

const telegramRouter = Router()

telegramRouter.get(
  '/generate-token',
  passport.authenticate('jwt', { session: false }),
  telegramToken
)

export default telegramRouter
