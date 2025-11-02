
import React from 'react';
import { type ImageFile } from '../types';
import { ImageCard } from './ImageCard';
import { formatBytes } from '../utils/fileUtils';

interface ImageGridProps {
    files: ImageFile[];
    onPreview: (file: ImageFile) => void;
    onDelete: (id: string) => void;
    quality: number;
    setQuality: (quality: number) => void;
    isLossless: boolean;
    setIsLossless: (isLossless: boolean) => void;
    onCompressAll: () => void;
    onClearAll: () => void;
    onDownloadAll: () => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
    files,
    onPreview,
    onDelete,
    quality,
    setQuality,
    isLossless,
    setIsLossless,
    onCompressAll,
    onClearAll,
    onDownloadAll,
}) => {
    if (files.length === 0) {
        return null;
    }
    
    const compressedCount = files.filter(f => f.status === 'done').length;

    return (
        <div className="space-y-6">
            <div className="hidden md:flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-card glow-border">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="lossless-toggle-desktop"
                            checked={isLossless}
                            onChange={(e) => setIsLossless(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-500 text-sky-500 bg-gray-800 focus:ring-sky-600 focus:ring-2"
                        />
                        <label htmlFor="lossless-toggle-desktop" className="text-white font-medium cursor-pointer">Lossless</label>
                    </div>
                    <label htmlFor="quality-slider-desktop" className={`text-white font-medium transition-opacity ${isLossless ? 'opacity-50' : 'opacity-100'}`}>Quality: {isLossless ? 100 : quality}</label>
                    <input
                        id="quality-slider-desktop"
                        type="range"
                        min="1"
                        max="100"
                        value={isLossless ? 100 : quality}
                        disabled={isLossless}
                        onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                        className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb disabled:opacity-50"
                    />
                </div>
                <div className="flex items-center space-x-2">
                     {compressedCount > 1 && (
                        <button onClick={onDownloadAll} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-300">
                            Download All (.zip)
                        </button>
                    )}
                    <button onClick={onCompressAll} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors duration-300">
                        Compress All
                    </button>
                    <button onClick={onClearAll} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300">
                        Clear All
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map(file => (
                    <ImageCard
                        key={file.id}
                        file={file}
                        onPreview={() => onPreview(file)}
                        onDelete={() => onDelete(file.id)}
                    />
                ))}
            </div>
        </div>
    );
};