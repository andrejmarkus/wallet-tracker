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