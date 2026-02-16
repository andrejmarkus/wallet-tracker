import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { LoginFormData } from "../../../types";
import { loginFormDataSchema } from "../../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/context/AuthContext";
import { useState } from "react";

const LoginForm = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormDataSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        api
        .post("/auth/login", data)
        .then(async _ => {
            await fetchUser();
            toast.success("Login successful!");
            navigate("/app", { replace: true });
        })
        .catch(error => {
            const message = error.response?.data?.message || "Invalid username or password.";
            toast.error(message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-md mx-auto">
            <fieldset className="fieldset">
                <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Username</legend>
                <input 
                    id="username" 
                    type="text" 
                    className={`input w-full validator ${errors.username ? 'input-error' : ''}`} 
                    placeholder="username"
                    {...register("username")} 
                />
                {errors.username && <p className="fieldset-label text-error">{errors.username.message}</p>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Password</legend>
                <input 
                    id="password" 
                    type="password" 
                    className={`input w-full validator ${errors.password ? 'input-error' : ''}`} 
                    placeholder="••••••••"
                    {...register("password")} 
                />
                {errors.password && <p className="fieldset-label text-error">{errors.password.message}</p>}
            </fieldset>

            <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full mt-4 font-black shadow-lg shadow-primary/20 h-12"
            >
                {isLoading ? <span className="loading loading-spinner" /> : "Sign In"}
            </button>
        </form>
    )
}

export default LoginForm
