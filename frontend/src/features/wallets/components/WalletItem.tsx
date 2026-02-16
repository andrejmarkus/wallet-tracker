import api from '../../../lib/api';
import { toast } from 'react-toastify';
import type { WalletData } from '../../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePumpPortal } from '../../../lib/hooks/usePumpPortal';
import { LuTrash, LuCopy, LuExternalLink, LuPencil, LuCheck, LuX } from 'react-icons/lu';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-content/5 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="card-body p-6">
                <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <div className="avatar placeholder">
                            <div className="bg-linear-to-br from-primary to-secondary text-primary-content rounded-2xl w-14 h-14 shadow-lg shadow-primary/20">
                                <span className="text-xl font-black uppercase">
                                    {(name ?? address).slice(0, 2)}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="input input-bordered input-sm focus:input-primary transition-all w-full md:w-auto"
                                        placeholder={truncateAddress(address)}
                                        autoFocus
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={updateMutation.isPending}
                                            className="btn btn-sm btn-circle btn-success"
                                            title="Save"
                                        >
                                            {updateMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : <LuCheck size={16} />}
                                        </button>
                                        <button
                                            onClick={handleRemoveName}
                                            className="btn btn-sm btn-circle btn-error"
                                            title="Remove Name"
                                        >
                                            <LuTrash size={14} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="btn btn-sm btn-circle btn-ghost"
                                            title="Cancel"
                                        >
                                            <LuX size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold truncate max-w-50 md:max-w-md">
                                        {name ?? truncateAddress(address)}
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <LuPencil size={12} />
                                    </button>
                                </div>
                            )}
                            <div className="text-xs font-mono opacity-40 mt-1 mb-2 truncate">
                                {address}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleCopyAddress}
                                    className="btn btn-xs btn-outline btn-primary gap-1 lowercase font-black"
                                >
                                    <LuCopy size={12} /> copy addr
                                </button>
                                <a
                                    href={`https://solscan.io/account/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-xs btn-outline gap-1 lowercase font-black"
                                >
                                    <LuExternalLink size={12} /> solscan
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 shrink-0 self-end md:self-center">
                        <button
                            onClick={() => handleDeleteWallet(address)}
                            disabled={mutation.isPending}
                            className="btn btn-ghost border-error/20 hover:bg-error hover:text-error-content btn-square btn-md transition-colors"
                        >
                            {mutation.isPending ? (
                                <span className="loading loading-spinner loading-md" />
                            ) : (
                                <LuTrash size={18} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default WalletItem;