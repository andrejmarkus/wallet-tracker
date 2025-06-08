import { z } from "zod";
import { PublicKey } from "@solana/web3.js";

export const walletSchema = z.object({
    address: z
        .string()
        .min(32, "Solana wallet address must be between 32 and 44 characters long")
        .max(44, "Solana wallet address must be between 32 and 44 characters long"),
    name: z.string().optional().nullable()
}).refine((data) => {
    try {
        const publicKey = new PublicKey(data.address);
        return PublicKey.isOnCurve(publicKey.toBytes());
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