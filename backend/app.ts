import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { ORIGIN_URL } from './config/env'
import './config/passport'
import logger from './utils/logger'

import errorMiddleware from './middlewares/error.middleware'
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import tokenRouter from './routes/token.routes'
import telegramRouter from './routes/telegram.routes'
import walletRouter from './routes/wallet.routes'

const app = express()

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet Tracker API',
            version: '1.0.0',
            description: 'API documentation for the Wallet Tracker application',
        },
        servers: [
            {
                url: '/api/v1',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Dynamically find route files whether in src or dist
    apis: [
        path.join(__dirname, 'routes', '*.ts').replace(/\\/g, '/'),
        path.join(__dirname, 'routes', '*.js').replace(/\\/g, '/')
    ],
};



const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve swagger spec as JSON
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Use a cleaner registration for Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Request logger middleware
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

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
