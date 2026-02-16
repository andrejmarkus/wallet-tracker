import { NavLink } from 'react-router-dom'
import LoginForm from '../features/auth/components/LoginForm'
import PageTransition from '../components/common/PageTransition'
import { motion } from 'framer-motion'

const Login = () => {
  return (
    <PageTransition>
      <div className="flex items-center justify-center bg-base-200 min-h-[95vh] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse delay-1000"></div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg p-10 bg-base-100 rounded-2xl shadow-2xl flex flex-col gap-6 z-10 border border-base-300"
          >
              <div className="text-center">
                  <h2 className="text-4xl font-black mb-2">Welcome Back</h2>
                  <p className="text-base-content/60">Enter your credentials to access your dashboard</p>
              </div>
            <div className="divider opacity-50"></div>
            <LoginForm />
            <div className="divider opacity-50"></div>
            <p className="text-center text-base-content/70">
              Don't have an account? <NavLink className="text-primary font-bold hover:underline" to={"/register"}>Register</NavLink>
            </p>
          </motion.div>
      </div>
    </PageTransition>
  )
}

export default Login
