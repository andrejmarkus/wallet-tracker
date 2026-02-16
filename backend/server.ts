import app from './app'
import http from 'http'
import { ORIGIN_URL, PORT } from './config/env'
import { Server } from 'socket.io'
import registerSocketHandlers from './sockets'
import { initializeTransactionBot, startBot } from './bots/transactionBot'

const server = http.createServer(app)

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 60 * 1000, // 1 minute
  },
  cors: {
    origin: ORIGIN_URL ?? true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})

registerSocketHandlers(io)

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  await initializeTransactionBot()
  startBot()
})
