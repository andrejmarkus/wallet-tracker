import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema } from "../../../schemas";
import type { WalletData } from "../../../types";
import { useAddWallet } from "../hooks/useWallets";
import { LuPlus } from "react-icons/lu";

const WalletAddition = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<WalletData>({
        resolver: zodResolver(walletSchema),
    });

    const mutation = useAddWallet(reset);

    const onSubmit = async (data: WalletData) => mutation.mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 items-center">
            <fieldset className="fieldset w-full">
                <input id="address" type="text" className="input w-full" placeholder="Wallet Address" required {...register("address")} />
                {errors.address && <p className="label text-error">{errors.address.message}</p>}
            </fieldset>
            <fieldset className="fieldset w-full">
                <input id="name" type="text" className="input w-full" placeholder="Wallet Name (optional)" {...register("name")} />
                {errors.name && <p className="label text-error">{errors.name.message}</p>}
            </fieldset>
            <div className="tooltip" data-tip="Add Wallet">
                <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-square">
                    { mutation.isPending ? <span className="loading loading-spinner loading-lg" /> : <LuPlus /> }
                </button>
            </div>
        </form>
    )
}

export default WalletAddition