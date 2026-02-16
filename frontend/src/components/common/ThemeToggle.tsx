import { useEffect, useState } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'business');

    useEffect(() => {
        const doc = document.documentElement;
        doc.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'night' ? 'light' : 'night');
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle"
            aria-label="Toggle Theme"
        >
            {theme === 'night' ? (
                <LuSun className="h-5 w-5 text-yellow-500" />
            ) : (
                <LuMoon className="h-5 w-5" />
            )}
        </button>
    );
};

export default ThemeToggle;
