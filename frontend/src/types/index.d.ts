import type { z } from "zod";
import type { registerFormDataSchema, loginFormDataSchema, walletSchema } from "../schemas";
import type { UseFormRegister } from "react-hook-form";

declare type RegisterFormData = z.infer<typeof registerFormDataSchema>;
declare type LoginFormData = z.infer<typeof loginFormDataSchema>;
declare type WalletData = z.infer<typeof walletSchema>;

declare type User = {
    id: string;
    email: string;
    username: string;
    telegramChatId?: string | null;
}

declare type Transaction = {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    currencyName: string;
    currencySymbol: string;
    solanaPrice: number;
    solanaAmount: number;
    tokenMarketCapInSolana: number;
    tokenAmount: number;
    tokenUnitPrice: number;
    tokenTotalValue: number;
    tokenMarketCap: number;
    signature: string;
    traderPublicKey: string;
    txType: "buy" | "sell";
    pool: string;
}