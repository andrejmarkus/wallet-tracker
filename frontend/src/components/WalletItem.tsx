import api from '../lib/api';
import { toast } from 'react-toastify/unstyled';
import type { WalletData } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePumpPortal } from '../lib/hooks/usePumpPortal';
import { LuTrash, LuCopy, LuExternalLink } from 'react-icons/lu';

const WalletItem = ({ address }: WalletData) => {
    const queryClient = useQueryClient();
    const { unsubscribeWallet } = usePumpPortal();

    const mutation = useMutation({
        mutationFn: (address: string) => api.delete(`/wallets/${address}`),
        onSuccess: () => {
            toast.success(`Wallet ${address} deleted successfully!`);
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            unsubscribeWallet(address);
        },
        onError: (error: any) => {
            toast.error(`Error deleting wallet: ${error.message}`);
        },
    });

    const handleDeleteWallet = (address: string) => mutation.mutate(address);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        toast.success('Address copied to clipboard!');
    };

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-12">
                                <span className="text-xl">{address.slice(0, 2)}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-mono text-lg">
                                {truncateAddress(address)}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={handleCopyAddress}
                                    className="btn btn-xs btn-ghost gap-1"
                                >
                                    <LuCopy className="h-3 w-3" /> Copy
                                </button>
                                <a
                                    href={`https://solscan.io/account/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-xs btn-ghost gap-1"
                                >
                                    <LuExternalLink className="h-3 w-3" /> Solscan
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="tooltip" data-tip="Delete wallet">
                        <button
                            onClick={() => handleDeleteWallet(address)}
                            disabled={mutation.isPending}
                            className="btn btn-error btn-square"
                        >
                            {mutation.isPending ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <LuTrash size={15} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletItem;