import { z } from "zod";

export const walletSchema = z.object({
    address: z
        .string()
        .min(32, "Wallet address must be between 32 and 44 characters long")
        .max(44, "Wallet address must be between 32 and 44 characters long")
});