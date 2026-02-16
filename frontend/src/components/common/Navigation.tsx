import { NavLink } from 'react-router-dom'
import { useAuth } from '../../lib/context/AuthContext'
import AvatarDropdown from './AvatarDropdown'
import ThemeToggle from './ThemeToggle'

const Navigation = () => {
    const { user, isLoading } = useAuth();

    return (
        <nav className='navbar bg-base-100/80 backdrop-blur-md z-50 shadow-sm sticky top-0 left-0 right-0 border-b border-base-content/5'>
            <div className='flex-1'>
                <NavLink to={"/"} className='btn btn-ghost normal-case text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary'>
                    WT
                </NavLink>
            </div>
            {!isLoading && (
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {user ? (
                        <AvatarDropdown username={user.username} />
                    ) : (
                        <div className='flex gap-2'>
                            <NavLink to={"/login"} className='btn btn-ghost btn-sm'>Login</NavLink>
                            <NavLink to={"/register"} className='btn btn-primary btn-sm shadow-md'>Register</NavLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navigation
