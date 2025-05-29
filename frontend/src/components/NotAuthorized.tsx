import type { ReactNode } from 'react'
import { useAuth } from '../lib/context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NotAuthorized = ({ children }: {children: ReactNode}) => {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (user && !isLoading) {
            navigate('/app', { replace: true });
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return <span className="loading loading-spinner loading-lg"></span>;
    }

    return (
        <>{children}</>
    )
}

export default NotAuthorized