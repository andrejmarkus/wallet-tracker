import { use } from "react"
import api from "../lib/api";
import type { WalletData } from "../types";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletSchema } from "../schemas";

const fetchWallets = async () => {
    try {
        const res = await api.get('/wallets');
        return res.data.data.wallets as WalletData[];
    } catch (error: any) {
        toast.error(`Error fetching users: ${error.message}`);
    }
};
const walletsPromise = fetchWallets();

function Home() {
    const { register, handleSubmit, formState: { errors } } = useForm<WalletData>({
        resolver: zodResolver(walletSchema),
    });
    const wallets = use(walletsPromise);

    const onSubmit = async (data: WalletData) => {
        try {
            const res = await api.post('/wallets', data);
            toast.success(`Wallet ${res.data.data.wallet.address} added successfully!`);
        } catch (error: any) {
            toast.error(`Error adding wallet: ${error.message}`); 
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="py-4 flex flex-col gap-4">
                { wallets && wallets.length > 0 && wallets.map((user) => (
                    <div key={user.address} className="p-4 rounded base-100 shadow mb-2">
                        <h3 className="text-xl font-semibold">{user.address}</h3>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-stretch">
                <fieldset className="fieldset w-full">
                    <input id="address" type="text" className="input w-full" {...register("address")} />
                    {errors.address && <p className="label text-error">{errors.address.message}</p>}
                </fieldset>

                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    );
}

export default Home;