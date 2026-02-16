import { Outlet } from 'react-router-dom'
import Navigation from '../components/common/Navigation'
import PageTransition from '../components/common/PageTransition'

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navigation />
            <main className='flex-1'>
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
        </div>
    )
}

export default Layout