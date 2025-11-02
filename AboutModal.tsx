
import React from 'react';
import { ShieldCheckIcon, XMarkIcon } from './icons/Icons';

interface AboutModalProps {
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative w-full max-w-md m-4 p-6 md:p-8 rounded-2xl glass-card glow-border text-white animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-sky-500/20 rounded-full">
                         <ShieldCheckIcon className="w-12 h-12 text-sky-400" />
                    </div>
                   
                    <h2 className="text-2xl font-bold">Your Privacy is Paramount</h2>
                    <p className="text-gray-300">
                        PixPress performs all image compression directly in your web browser.
                    </p>
                    <p className="font-semibold text-sky-300 text-lg">
                        Your images never leave your device.
                    </p>
                    <p className="text-gray-400 text-sm">
                        There are no servers, no uploads, and no data collection. Everything is processed on your local machine, ensuring 100% privacy and security.
                    </p>
                </div>
            </div>
        </div>
    );
};