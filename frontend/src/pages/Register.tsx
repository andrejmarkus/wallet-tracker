import { NavLink } from "react-router-dom"
import RegisterForm from "../components/RegisterForm"

const Register = () => {
    return (
    <div className="flex items-center justify-center bg-gray-100 h-[95vh]">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md flex flex-col gap-3">
            <div>
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                <p className="text-center text-gray-600">Join us and start your journey!</p>
            </div>
            <RegisterForm />
            <p className="text-center text-gray-600">Already have an account? <NavLink className="link" to={"/login"}>Login</NavLink></p>
        </div>
    </div>
    )
}

export default Register