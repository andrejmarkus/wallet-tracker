import { useSuspenseWallets } from "../hooks/useWallets";
import WalletItem from "./WalletItem";
import { useAuth } from "../../../lib/context/AuthContext";

const WalletsList = () => {
    const { user } = useAuth();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: wallets } = useSuspenseWallets();

  return (
    <>
        { wallets?.length === 0 ? (
            <p className="text-center text-gray-500">No wallets found. Please add a wallet.</p>
        ) : wallets?.map(wallet => (
            <WalletItem key={wallet.address} address={wallet.address} name={wallet.name} />
        )
        )}
    </>
  )
}

export default WalletsList