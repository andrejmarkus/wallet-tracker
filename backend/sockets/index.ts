import { Server } from 'socket.io';
import transactionSocket from './transaction.socket';
import helmet from 'helmet';

export default function registerSocketHandlers(io: Server): void {
  io.engine.use(helmet());

  transactionSocket(io.of('/transactions'));
}
