import app from './app'
import http from 'node:http'
import { ORIGIN_URL, PORT, NODE_ENV } from './config/env'
import { Server } from 'socket.io'
import registerSocketHandlers from './sockets'
import { initializeTransactionBot, startBot } from './bots/transactionBot'

const server = http.createServer(app)

const allowedOrigins = [
  ORIGIN_URL,
  'http://localhost:3000',
  'http://app.localhost',
  'http://localhost',
  'http://127.0.0.1:3000'
].filter(Boolean) as string[];

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 60 * 1000, // 1 minute
  },
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

registerSocketHandlers(io)

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  await initializeTransactionBot()
  startBot()
})
