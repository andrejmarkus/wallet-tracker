import { z } from "zod";

export const registerFormDataSchema = z.object({
    username: z.string().min(1, "Userame is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const loginFormDataSchema = z.object({
    username: z.string().min(1, "Userame is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const walletSchema = z.object({
    address: z
        .string()
        .min(32, "Wallet address must be between 32 and 44 characters long")
        .max(44, "Wallet address must be between 32 and 44 characters long")
});