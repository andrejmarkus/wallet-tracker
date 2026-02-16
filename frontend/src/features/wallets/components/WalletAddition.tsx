import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema } from "../../../schemas";
import type { WalletData } from "../../../types";
import { useAddWallet } from "../hooks/useWallets";
import { LuPlus, LuWallet } from "react-icons/lu";

const WalletAddition = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<WalletData>({
        resolver: zodResolver(walletSchema),
    });

    const mutation = useAddWallet(reset);

    const onSubmit = async (data: WalletData) => mutation.mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200/50 p-6 rounded-2xl border border-dashed border-base-content/20 hover:border-primary/50 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full space-y-4">
                    <fieldset className="fieldset w-full p-0">
                        <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Solana Address</legend>
                        <div className="relative w-full">
                            <LuWallet className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 z-10" />
                            <input 
                                id="address" 
                                type="text" 
                                className={`input w-full pl-11 validator ${errors.address ? 'input-error' : ''}`} 
                                placeholder="Enter public key..." 
                                required 
                                {...register("address")} 
                            />
                        </div>
                        {errors.address && <p className="fieldset-label text-error">{errors.address.message}</p>}
                    </fieldset>

                    <fieldset className="fieldset w-full p-0">
                        <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Alias (Optional)</legend>
                        <input 
                            id="name" 
                            type="text" 
                            className={`input w-full validator ${errors.name ? 'input-error' : ''}`} 
                            placeholder="Whale #1, Copy Trader..." 
                            {...register("name")} 
                        />
                        {errors.name && <p className="fieldset-label text-error">{errors.name.message}</p>}
                    </fieldset>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                    <button 
                        type="submit" 
                        disabled={mutation.isPending} 
                        className="btn btn-primary btn-md w-full md:w-auto md:h-[115px] md:px-8 flex-col gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    >
                        { mutation.isPending ? (
                            <span className="loading loading-spinner" />
                        ) : (
                            <>
                                <LuPlus size={24} />
                                <span className="text-xs uppercase font-black">Track</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}


export default WalletAddition