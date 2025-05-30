import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Transaction } from "../../types";
import { useAuth } from "../context/AuthContext";

let socket: Socket | null = null;

function getSocket() {
    socket ??= io(`${import.meta.env.VITE_API_URL}transactions`, {
        transports: ["websocket"]
    });

    return socket;
}

export function usePumpPortal(onMessage?: (transaction: Transaction) => void) {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuth();

    const subscribeWallet = (walletAddress: string) => {
        console.log("[WebSocket] Subscribing to wallet:", walletAddress);
        socketRef.current?.emit("subscribeWallet", { userId: user?.id, walletAddress });
    };

    function unsubscribeWallet(walletAddress: string) {
        console.log("[WebSocket] Unsubscribing from wallet:", walletAddress);
        socketRef.current?.emit("unsubscribeWallet", { userId: user?.id, walletAddress });
    }

    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[WebSocket] Connected");
        });

        socket.on("disconnect", () => {
            console.log("[WebSocket] Disconnected");
        });

        socket.on("connect_error", (err) => {
            console.error("[WebSocket] Connection error:", err);
        });

        socket.on("transactionUpdate", (transaction: Transaction) => {
            try {
                console.log("[WebSocket] Transaction update received:", transaction);
                onMessage?.(transaction);
            } catch (err) {
                console.error("[WebSocket] Invalid message:", err);
            }
        });

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [user, onMessage]);

    return { subscribeWallet, unsubscribeWallet };
}