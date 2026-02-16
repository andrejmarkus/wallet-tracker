import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { LoginFormData } from "../../../types";
import { loginFormDataSchema } from "../../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/context/AuthContext";

const LoginForm = () => {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormDataSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        api
        .post("/auth/login", data)
        .then(async _ => {
            await fetchUser();
            navigate("/app", { replace: true });
            toast.success("Login successful!");
        })
        .catch(_ => {
            toast.error("Invalid username or password.");
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-md mx-auto">
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

            <button type="submit" className="btn btn-primary w-full mt-3">Login</button>
        </form>
    )
}

export default LoginForm