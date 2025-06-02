import { useSuspenseQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { WalletData } from "../types";
import WalletItem from "./WalletItem";
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

  return (
    <>
        { wallets?.length === 0 ? (
            <p className="text-center text-gray-500">No wallets found. Please add a wallet.</p>
        ) : wallets?.map(wallet => (
            <WalletItem key={wallet.address} address={wallet.address} />
        )
        )}
    </>
  )
}

export default WalletsList