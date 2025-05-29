import { NavLink } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <>
      <LoginForm />
      <NavLink to="/register" className="link link-primary mt-4">
        Don't have an account? Register here
      </NavLink>
    </>
  )
}

export default Login