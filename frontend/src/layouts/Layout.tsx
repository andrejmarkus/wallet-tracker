import { Outlet } from 'react-router-dom'
import Navigation from '../components/Navigation'

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navigation />
            <main className='flex-1 container mx-auto'>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout