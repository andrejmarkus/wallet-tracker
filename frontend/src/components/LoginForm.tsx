import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { LoginFormData } from "../types";
import { loginFormDataSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormDataSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        const response = await api.post("/auth/login", data);
        if (response.status === 200) {
            navigate('/');
            toast.success("Login successful!");
            return;
        }
        toast.error(`Login failed. ${response.data.message ?? 'Please try again.'}`);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <h2 className="text-3xl text-center font-bold">Login</h2>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Username</legend>
                <input id="username" type="text" className="input w-full" {...register("username")} />
                {errors.username && <p className="label text-error">{errors.username.message}</p>}
            </fieldset>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Password</legend>
                <input id="password" type="password" className="input w-full" {...register("password")} />
                {errors.password && <p className="label text-error">{errors.password.message}</p>}
            </fieldset>

            <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
    )
}

export default LoginForm