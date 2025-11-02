
import React, { useState, useEffect, useRef } from 'react';
import { type ImageFile } from '../types';
import { XMarkIcon, DownloadIcon, ArrowPathIcon } from './icons/Icons';
import { formatBytes } from '../utils/fileUtils';

interface PreviewModalProps {
    file: ImageFile;
    onClose: () => void;
    onRecompress: (file: ImageFile) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose, onRecompress }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const [originalUrl, setOriginalUrl] = useState<string>('');
    const [compressedUrl, setCompressedUrl] = useState<string>('');
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [imageWidth, setImageWidth] = useState(0);

    useEffect(() => {
        const original = URL.createObjectURL(file.originalFile);
        const compressed = file.compressedBlob ? URL.createObjectURL(file.compressedBlob) : '';
        setOriginalUrl(original);
        setCompressedUrl(compressed);

        const img = new Image();
        img.src = original;
        img.onload = () => {
            if (imageContainerRef.current) {
                const containerWidth = imageContainerRef.current.offsetWidth;
                const containerHeight = imageContainerRef.current.offsetHeight;
                const imgAspectRatio = img.width / img.height;
                const containerAspectRatio = containerWidth / containerHeight;

                if (imgAspectRatio > containerAspectRatio) {
                    setImageWidth(containerWidth);
                } else {
                    setImageWidth(containerHeight * imgAspectRatio);
                }
            }
        }

        return () => {
            URL.revokeObjectURL(original);
            if (compressed) URL.revokeObjectURL(compressed);
        };
    }, [file]);
    
    const handleDownload = () => {
        if (file.compressedBlob) {
            const link = document.createElement('a');
            link.href = compressedUrl;
            const nameParts = file.originalFile.name.split('.');
            const extension = nameParts.pop();
            link.download = `${nameParts.join('.')}-compressed.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const savingPercentage = file.originalSize && file.compressedSize ? Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative w-full max-w-4xl h-[90vh] m-4 p-4 rounded-2xl glass-card glow-border text-white flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg">{file.originalFile.name}</h3>
                         <div className="text-xs text-gray-400 space-x-4">
                            <span>Original: {formatBytes(file.originalSize)}</span>
                            {file.compressedSize && (
                                <span className="text-green-400">Compressed: {formatBytes(file.compressedSize)} ({savingPercentage}% saved)</span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <main ref={imageContainerRef} className="flex-grow my-4 flex items-center justify-center relative overflow-hidden">
                   <div className="relative" style={{width: `${imageWidth}px`}}>
                       <img src={originalUrl} alt="Original" className="max-w-full max-h-full block"/>
                       <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${sliderValue}%` }}>
                           <img src={compressedUrl} alt="Compressed" className="max-w-none max-h-full h-full block" style={{width: `${imageWidth}px`}} />
                       </div>
                       <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Compressed</div>
                       <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-sm">Original</div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full cursor-ew-resize appearance-none bg-transparent preview-slider"
                            aria-label="Image comparison slider"
                        />
                   </div>
                </main>

                <footer className="flex-shrink-0 flex items-center justify-center gap-4 pt-3 border-t border-white/20">
                    <button onClick={() => onRecompress(file)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors">
                        <ArrowPathIcon className="w-5 h-5"/>
                        Recompress
                    </button>
                     <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        Download
                    </button>
                </footer>
            </div>
        </div>
    );
};