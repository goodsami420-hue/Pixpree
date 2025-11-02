
import React from 'react';
import { formatBytes } from '../utils/fileUtils';

interface BottomBarProps {
    quality: number;
    setQuality: (q: number) => void;
    isLossless: boolean;
    setIsLossless: (isLossless: boolean) => void;
    onCompressAll: () => void;
    totalOriginalSize: number;
    totalCompressedSize: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({ quality, setQuality, isLossless, setIsLossless, onCompressAll, totalOriginalSize, totalCompressedSize }) => {
    
    const totalSavings = totalOriginalSize > 0 && totalCompressedSize > 0
        ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
        : 0;
        
    if (totalOriginalSize === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 glass-card border-t border-white/20 md:hidden">
            <div className="flex flex-col space-y-3">
                 <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="lossless-toggle-mobile"
                            checked={isLossless}
                            onChange={(e) => setIsLossless(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-500 text-sky-500 bg-gray-800 focus:ring-sky-600 focus:ring-2"
                        />
                        <label htmlFor="lossless-toggle-mobile" className="text-sm font-medium text-white cursor-pointer">Lossless</label>
                    </div>
                    <input
                        id="quality"
                        type="range"
                        min="1"
                        max="100"
                        value={isLossless ? 100 : quality}
                        disabled={isLossless}
                        onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb disabled:opacity-50"
                    />
                    <span className={`text-sm font-medium text-white whitespace-nowrap transition-opacity ${isLossless ? 'opacity-50' : 'opacity-100'}`}>
                        {isLossless ? 100 : quality}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-300">
                        {totalCompressedSize > 0 && (
                             <div>
                                <span className="font-bold text-green-400">{totalSavings}% Saved</span>
                                <span className="ml-2">({formatBytes(totalOriginalSize - totalCompressedSize)})</span>
                            </div>
                        )}
                       
                    </div>
                    <button
                        onClick={onCompressAll}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-lg shadow-sky-600/30 transition-all duration-300 transform hover:scale-105"
                    >
                        Compress All
                    </button>
                </div>
            </div>
        </div>
    );
};