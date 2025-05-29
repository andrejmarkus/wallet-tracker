import app from './app'
import http from 'http'
import { PORT } from './config/env'
import { Server } from 'socket.io'
import registerSocketHandlers from './sockets'
import transactionBot from './bots/transactionBot'

const server = http.createServer(app)

const io = new Server(server)

registerSocketHandlers(io)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  transactionBot.start()
})
