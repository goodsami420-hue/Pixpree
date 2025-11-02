
import React from 'react';
import { SunIcon, MoonIcon, CodeBracketIcon } from './icons/Icons';

interface HeaderProps {
    onAboutClick: () => void;
    onThemeToggle: () => void;
    theme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ onAboutClick, onThemeToggle, theme }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">PixPress</h1>
                    </div>
                    <nav className="flex items-center space-x-2 md:space-x-4">
                         <button
                            onClick={onAboutClick}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors duration-300"
                            aria-label="About this application"
                        >
                            <CodeBracketIcon className="h-5 w-5" />
                           <span className="hidden sm:inline">About</span>
                        </button>
                        <button
                            onClick={onThemeToggle}
                            className="p-2 rounded-full text-gray-200 hover:bg-white/10 transition-colors duration-300"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};