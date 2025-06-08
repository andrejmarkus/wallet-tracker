import api from '../lib/api';
import { toast } from 'react-toastify';
import type { WalletData } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePumpPortal } from '../lib/hooks/usePumpPortal';
import { LuTrash, LuCopy, LuExternalLink, LuPencil, LuCheck, LuX } from 'react-icons/lu';
import { useState } from 'react';

const WalletItem = ({ address, name }: WalletData) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name ?? '');
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

    const updateMutation = useMutation({
        mutationFn: (newName: string | null) => 
            api.patch(`/wallets/${address}`, { name: newName }),
        onSuccess: () => {
            toast.success('Wallet name updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast.error(`Error updating wallet name: ${error.message}`);
        },
    });

    const handleDeleteWallet = (address: string) => mutation.mutate(address);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        toast.success('Address copied to clipboard!');
    };

    const handleUpdateName = () => {
        if (editedName.trim() === name) {
            setIsEditing(false);
            return;
        }
        updateMutation.mutate(editedName.trim());
    };

    const handleCancelEdit = () => {
        setEditedName(name ?? '');
        setIsEditing(false);
    };

    const handleRemoveName = () => {
        setEditedName('');
        updateMutation.mutate(null);
    }

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
                                <span className="text-xl">{ name?.slice(0, 2) ?? address.slice(0, 2) }</span>
                            </div>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="input input-sm input-bordered w-full max-w-xs"
                                        placeholder={truncateAddress(address)}
                                    />
                                    <div className="tooltip" data-tip="Remove name">
                                        <button
                                            onClick={handleRemoveName}
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-error btn-square"
                                        >
                                            {updateMutation.isPending ? (
                                                <span className="loading loading-spinner loading-sm" />
                                            ) : (
                                                <LuTrash size={15} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="tooltip" data-tip="Update name">
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-success btn-square"
                                        >
                                            {updateMutation.isPending ? (
                                                <span className="loading loading-spinner loading-sm" />
                                            ) : (
                                                <LuCheck size={15} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="tooltip" data-tip="Cancel edit">
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-ghost btn-square"
                                        >
                                            <LuX size={15} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <h3 className="font-mono text-lg flex items-center gap-2">
                                    {name ?? truncateAddress(address)}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-xs btn-ghost btn-square"
                                    >
                                        <LuPencil size={12} />
                                    </button>
                                </h3>
                            )}
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