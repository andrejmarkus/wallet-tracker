import { useSuspenseQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { WalletData } from "../types";
import WalletItem from "./WalletItem";
import { usePumpPortal } from "../lib/hooks/usePumpPortal";
import { useAuth } from "../lib/context/AuthContext";

const WalletsList = () => {
    const { user } = useAuth();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: wallets } = useSuspenseQuery<WalletData[]>({
        queryKey: ['wallets'],
        queryFn: async () => {
            const response = await api.get('/wallets');
            return response.data.data.wallets as WalletData[];
        }
    });
    
    usePumpPortal((transaction) => {
        console.log("[WebSocket] Transaction update received:", transaction);
    });

  return (
    <>
        { wallets?.map(wallet => (
            <WalletItem key={wallet.address} address={wallet.address} />
        ))}
    </>
  )
}

export default WalletsList