import { NavLink } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 h-[95vh]">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md flex flex-col gap-3">
            <div>
                <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
                <p className="text-center text-gray-600">Welcome back! Please enter your credentials to continue.</p>
            </div>
          <LoginForm />
          <p className="text-center text-gray-600">Don't have an account? <NavLink className="link" to={"/register"}>Register</NavLink></p>
        </div>
    </div>
  )
}

export default Login