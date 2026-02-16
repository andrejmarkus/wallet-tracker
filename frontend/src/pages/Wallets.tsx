import WalletsList from "../features/wallets/components/WalletsList";
import WalletAddition from "../features/wallets/components/WalletAddition";
import PageTransition from "../components/common/PageTransition";

function Wallets() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-base-200">
                <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="text-3xl font-semibold">Manage tracked wallets</h2>
                            <p className="text-base-content/60">
                                Add any Solana wallet you want to track. You will receive notifications about their transactions.
                            </p>
                            <WalletAddition />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <WalletsList />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default Wallets;
