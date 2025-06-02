import WalletsList from "../components/WalletsList";
import WalletAddition from "../components/WalletAddition";

function Wallets() {
    return (
        <div className="container mx-auto py-4 flex flex-col">
            <h1 className="text-2xl font-bold">Your Wallets</h1>
            <WalletAddition />
            <div className="my-3">
                <WalletsList />
            </div>
        </div>
    );
}

export default Wallets;