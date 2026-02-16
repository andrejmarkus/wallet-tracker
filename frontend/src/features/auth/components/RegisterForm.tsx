import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import type { RegisterFormData } from "../../../types";
import { registerFormDataSchema } from "../../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/context/AuthContext";
import { useState } from "react";

const RegisterForm = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormDataSchema),
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/register", {
                username: data.username,
                email: data.email,
                password: data.password
            });
            if (response.status === 201) {
                await fetchUser();
                toast.success("Registration successful!");
                navigate('/app', { replace: true });
                return;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <fieldset className="fieldset">
                <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Username</legend>
                <input 
                    id="username" 
                    type="text" 
                    className={`input w-full validator ${errors.username ? 'input-error' : ''}`} 
                    placeholder="johndoe"
                    {...register("username")} 
                />
                {errors.username && <p className="fieldset-label text-error">{errors.username.message}</p>}
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Email</legend>
                <input 
                    id="email" 
                    type="email" 
                    className={`input w-full validator ${errors.email ? 'input-error' : ''}`} 
                    placeholder="email@example.com"
                    {...register("email")} 
                />
                {errors.email && <p className="fieldset-label text-error">{errors.email.message}</p>}
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

            <fieldset className="fieldset">
                <legend className="fieldset-legend font-black uppercase text-xs opacity-50">Confirm Password</legend>
                <input 
                    id="confirmPassword" 
                    type="password" 
                    className={`input w-full validator ${errors.confirmPassword ? 'input-error' : ''}`} 
                    placeholder="••••••••"
                    {...register("confirmPassword")} 
                />
                {errors.confirmPassword && <p className="fieldset-label text-error">{errors.confirmPassword.message}</p>}
            </fieldset>

            <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full mt-4 font-black shadow-lg shadow-primary/20 h-12"
            >
                {isLoading ? <span className="loading loading-spinner" /> : "Create Account"}
            </button>
        </form>
    )
}

export default RegisterForm
