import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc, Socket as ClientSocket } from "socket.io-client";
import { createServer } from "http";
import { PORT } from "../config/env";

import registerSocketHandlers from "../sockets";

export function waitFor(socket: ServerSocket | ClientSocket, event: string): Promise<any> {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

export async function setupTestServer(authCookie: string): Promise<{ io: Server; clientSocket: ClientSocket; serverSocket: ServerSocket }> {
    const httpServer = createServer();

    const io = new Server(httpServer);
    registerSocketHandlers(io);
    httpServer.listen(PORT);


    let serverSocket: ServerSocket | undefined;
    io.of("/transactions").on("connection", (connectedSocket: ServerSocket) => {
        serverSocket = connectedSocket;
    });

    const clientSocket = ioc(`http://localhost:${PORT}/transactions`, {
        transports: ["websocket"],
        extraHeaders: {
            Cookie: authCookie,
        }
    });

    await waitFor(clientSocket, "connect");
    if (!serverSocket) {
        throw new Error("Server socket is not defined after connection");
    }

    return { io, clientSocket, serverSocket };
}