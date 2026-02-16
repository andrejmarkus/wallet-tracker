import { z } from "zod";
import { PublicKey } from "@solana/web3.js";

export const walletSchema = z.object({
    address: z
        .string()
        .trim()
        .min(32, "Solana wallet address must be between 32 and 44 characters long")
        .max(44, "Solana wallet address must be between 32 and 44 characters long"),
    name: z.string().optional().nullable()
}).refine((data) => {
    try {
        new PublicKey(data.address);
        return true;
    } catch {
        return false;
    }
}, {
    message: "Invalid Solana wallet address",
    path: ["address"]
});

export const walletUpdateSchema = z.object({
    name: z.string().optional().nullable()
});