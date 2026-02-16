import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'node:path'
import { ORIGIN_URL, NODE_ENV } from './config/env'
import './config/passport'
import logger from './utils/logger'

import errorMiddleware from './middlewares/error.middleware'
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import tokenRouter from './routes/token.routes'
import telegramRouter from './routes/telegram.routes'
import walletRouter from './routes/wallet.routes'

const app = express()

// Add a very early logger to catch everything including preflights
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        console.log(`[CORS PREFLIGHT] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    } else {
        console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    }
    next();
});

// Move CORS and basic setup to the top
app.use(cors({
    origin: (origin, callback) => {
        // In development, allow EVERYTHING
        if (NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        if (!origin) return callback(null, true);
        
        const allowed = [
            ORIGIN_URL,
            'http://localhost:3000',
            'http://localhost:3001',
            'http://app.localhost',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
        ].filter(Boolean) as string[];

        if (allowed.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS BLOCKED] Blocked origin: ${origin}`);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cookie'
    ],
    exposedHeaders: ['Set-Cookie', 'Content-Range', 'X-Content-Range'],
    credentials: true,
    optionsSuccessStatus: 200 
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}))

// Request logger middleware (moved below CORS so we can see preflights)
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', node_env: NODE_ENV });
});

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

app.use(passport.initialize())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tokens', tokenRouter)
app.use('/api/v1/telegram', telegramRouter)
app.use('/api/v1/wallets', walletRouter)

app.use(errorMiddleware)

export default app
