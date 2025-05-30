import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema } from "../schemas";
import type { WalletData } from "../types";
import { toast } from "react-toastify";
import api from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePumpPortal } from "../lib/hooks/usePumpPortal";

const WalletAddition = () => {
    const queryClient = useQueryClient();

     const { subscribeWallet } = usePumpPortal();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<WalletData>({
        resolver: zodResolver(walletSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: WalletData) => api.post('/wallets', data),
        onSuccess: (res) => {
            const address = res.data.data.wallet.address;
            toast.success(`Wallet ${address} added successfully!`);
            reset();
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            subscribeWallet(address);
        },
        onError: (error: any) => {
            toast.error(`Error adding wallet: ${error.message}`);
        }
    });

    const onSubmit = async (data: WalletData) => mutation.mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-stretch">
            <fieldset className="fieldset w-full">
                <div className="flex gap-2 items-center">
                    <input id="address" type="text" className="input w-full" {...register("address")} />
                    <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-square">
                        { mutation.isPending ? <span className="loading loading-spinner loading-lg" /> : <Plus /> }
                    </button>
                </div>
                {errors.address && <p className="label text-error">{errors.address.message}</p>}
            </fieldset>
        </form>
    )
}

export default WalletAddition