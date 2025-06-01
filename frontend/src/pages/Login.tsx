import { NavLink } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <div className='flex flex-col gap-4 items-center'>
      <LoginForm />
      <NavLink to="/register" className="link link-primary mt-4">
        Don't have an account? Register here
      </NavLink>
    </div>
  )
}

export default Login