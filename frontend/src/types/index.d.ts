import type { z } from "zod";
import type { registerFormDataSchema, loginFormDataSchema } from "../schemas";
import type { UseFormRegister } from "react-hook-form";

declare type RegisterFormData = z.infer<typeof registerFormDataSchema>;
declare type LoginFormData = z.infer<typeof loginFormDataSchema>;

declare type User = {
    id: string;
    email: string;
    username: string;
    telegramChatId?: string | null;
}