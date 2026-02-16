import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { WalletData } from "../../../types";
import { toast } from "react-toastify";
import { usePumpPortal } from "../../../lib/hooks/usePumpPortal";

export const WALLETS_QUERY_KEY = ["wallets"];

export const useWallets = () => {
    return useQuery<WalletData[]>({
        queryKey: WALLETS_QUERY_KEY,
        queryFn: async () => {
            const res = await api.get("/wallets/authorized");
            return res.data.data.wallets;
        }
    });
};

export const useSuspenseWallets = () => {
    return useSuspenseQuery<WalletData[]>({
        queryKey: WALLETS_QUERY_KEY,
        queryFn: async () => {
            const res = await api.get("/wallets/authorized");
            return res.data.data.wallets;
        }
    });
};

export const useAddWallet = (reset?: () => void) => {
    const queryClient = useQueryClient();
    const { subscribeWallet } = usePumpPortal();

    return useMutation({
        mutationFn: async (data: WalletData) => {
            const res = await api.post("/wallets", data);
            return res.data;
        },
        onSuccess: (res) => {
            const address = res.data.wallet.address;
            toast.success(`Wallet ${address} added successfully!`);
            if (reset) reset();
            queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
            subscribeWallet(address);
        },
        onError: (error: any) => {
            toast.error(`Error adding wallet: ${error.message}`);
        }
    });
};

export const useDeleteWallet = () => {
    const queryClient = useQueryClient();
    const { unsubscribeWallet } = usePumpPortal();

    return useMutation({
        mutationFn: async (address: string) => {
            const res = await api.delete(`/wallets/${address}`);
            return res.data;
        },
        onSuccess: (_, address) => {
            toast.success("Wallet removed successfully.");
            queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
            unsubscribeWallet(address);
        },
        onError: (error: any) => {
            toast.error(`Failed to remove wallet: ${error.message}`);
        }
    });
};
