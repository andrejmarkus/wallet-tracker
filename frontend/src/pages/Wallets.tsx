import WalletsList from "../components/WalletsList";
import WalletAddition from "../components/WalletAddition";

function Wallets() {
    return (
        <div className="flex flex-col">
            <div className="my-3">
                <WalletsList />
            </div>
            <WalletAddition />
        </div>
    );
}

export default Wallets;