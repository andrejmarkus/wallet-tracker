import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Transaction } from "../../types";
import { useAuth } from "../context/AuthContext";
import api from "../api";

let socket: Socket | null = null;

function getSocket() {
    socket ??= io(`${import.meta.env.VITE_API_URL}transactions`, {
        transports: ["websocket"],
        autoConnect: false,
    });

    return socket;
}

export function usePumpPortal() {
    const { user } = useAuth();

    const subscribeWallet = (walletAddress: string) => {
        console.log("[WebSocket] Subscribing to wallet:", walletAddress);
        getSocket().emit("subscribeWallet", { userId: user?.id, walletAddress });
    };

    const unsubscribeWallet = (walletAddress: string) => {
        console.log("[WebSocket] Unsubscribing from wallet:", walletAddress);
        getSocket().emit("unsubscribeWallet", { userId: user?.id, walletAddress });
    };

    const onTransaction = (handler: (transaction: Transaction) => void) => {
        const s = getSocket();
        s.on("transaction", handler);
        return () => {
            s.off("transaction", handler);
        };
    };

    useEffect(() => {
        const s = getSocket();

        if (!s.connected) {
            console.log("[WebSocket] Connecting to Pump Portal");
            s.connect();
        }

        s.on("connect", () => {
            console.log("[WebSocket] Connected");
        });

        s.on("disconnect", () => {
            console.log("[WebSocket] Disconnected");
        });

        s.on("connect_error", async (err) => {
            if (err.message === "Authentication error: Unauthorized") {
                api
                .post("/auth/refresh")
                .then(() => {
                    console.log("[WebSocket] Reconnected after token refresh");
                    s.connect();
                })
                .catch(() => {
                    console.error("[WebSocket] Failed to refresh token, disconnecting");
                    s.disconnect();
                });
            } else {
                console.error("[WebSocket] Connection error:", err);
            }
        });

        return () => {
            // No cleanup here to maintain connection across hooks
        };
    }, []);

    return { subscribeWallet, unsubscribeWallet, onTransaction };
}
