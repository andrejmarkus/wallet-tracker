import { NavLink } from 'react-router-dom'
import { useAuth } from '../../lib/context/AuthContext'
import AvatarDropdown from './AvatarDropdown'

const Navigation = () => {
    const { user, isLoading } = useAuth();

    return (
        <nav className='navbar bg-base-100 z-10 shadow-sm sticky top-0 left-0 right-0'>
            <div className='flex-1'>
                <NavLink to={"/"} className='btn btn-ghost normal-case text-xl'>Wallet Tracker</NavLink>
            </div>
            {!isLoading && (
                <div>
                    {user ? (
                        <AvatarDropdown username={user.username} />
                    ) : (
                        <div className='flex gap-2'>
                            <NavLink to={"/login"} className='btn btn-ghost'>Login</NavLink>
                            <NavLink to={"/register"} className='btn btn-primary'>Register</NavLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navigation