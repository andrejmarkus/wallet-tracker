import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import type { RegisterFormData } from "../types";
import { registerFormDataSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormDataSchema),
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        const response = await api.post("/auth/register", {
            username: data.username,
            email: data.email,
            password: data.password
        });
        if (response.status === 201) {
            navigate('/app', { replace: true });
            toast.success("Registration successful!");
            return;
        }
        toast.error("Registration failed. ", response.data.message);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <h2 className="text-3xl text-center font-bold">Register</h2>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Username</legend>
                <input id="username" type="text" className="input w-full" {...register("username")} />
                {errors.username && <p className="label text-error">{errors.username.message}</p>}
            </fieldset>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Email</legend>
                <input id="email" type="email" className="input w-full" {...register("email")} />
                {errors.email && <p className="label text-error">{errors.email.message}</p>}
            </fieldset>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Password</legend>
                <input id="password" type="password" className="input w-full" {...register("password")} />
                {errors.password && <p className="label text-error">{errors.password.message}</p>}
            </fieldset>

            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Confirm Password</legend>
                <input id="confirmPassword" type="password" className="input w-full" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="label text-error">{errors.confirmPassword.message}</p>}
            </fieldset>

            <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
    )
}

export default RegisterForm