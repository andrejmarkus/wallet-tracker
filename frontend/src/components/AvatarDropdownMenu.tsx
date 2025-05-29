import { NavLink, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { toast } from 'react-toastify';
import { useAuth } from '../lib/context/AuthContext';
import { LogOut, User } from 'lucide-react';

const AvatarDropdownMenu = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        api
        .post('/auth/logout')
        .then(async () => {
            setUser(null);
            navigate('/', { replace: true });
        })
        .catch((error) => {
            toast.error('Logout failed:', error);
        });
    }

    return (
        <li>
            <NavLink to={"/profile"}>
                <User />
                Profile
            </NavLink>
            <button onClick={handleLogout}>
                <LogOut />
                Logout
            </button>
        </li>
    )
}

export default AvatarDropdownMenu