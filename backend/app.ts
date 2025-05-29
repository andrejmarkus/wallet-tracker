import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import { ORIGIN_URL } from './config/env'
import './config/passport'

import errorMiddleware from './middlewares/error.middleware'
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import tokenRouter from './routes/token.routes'
import telegramRouter from './routes/telegram.routes'
import walletRouter from './routes/wallet.controller'

const app = express()

app.use(cors({
    origin: ORIGIN_URL ?? true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,   
    optionsSuccessStatus: 204,
    maxAge: 86400
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

app.use(passport.initialize())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tokens', tokenRouter)
app.use('/api/v1/telegram', telegramRouter)
app.use('/api/v1/wallets', walletRouter)

app.use(errorMiddleware)

export default app
