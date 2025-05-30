import api from '../lib/api';
import { toast } from 'react-toastify/unstyled';
import type { WalletData } from '../types'
import { Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePumpPortal } from '../lib/hooks/usePumpPortal';

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
        }
    });

    const handleDeleteWallet = (address: string) => mutation.mutate(address);

  return (
    <div key={address} className="p-4 rounded base-100 shadow mb-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{address}</h3>
        <button onClick={() => handleDeleteWallet(address)} disabled={mutation.isPending} className="btn btn-error btn-square">
            { mutation.isPending ? <span className='loading loading-spinner loading-lg' /> :  <Trash /> }
        </button>
    </div>
  )
}

export default WalletItem