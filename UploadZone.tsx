
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/Icons';

interface UploadZoneProps {
    onFileChange: (files: File[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange(Array.from(e.dataTransfer.files));
        }
    }, [onFileChange]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(Array.from(e.target.files));
        }
    };
    
    const dragClass = isDragging ? 'border-sky-400 bg-sky-500/10' : 'border-gray-500 hover:border-sky-400';

    return (
        <div 
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative group w-full p-8 md:p-12 mb-8 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${dragClass} glass-card glow-border`}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center justify-center text-gray-300 space-y-4">
                <div className={`p-4 rounded-full bg-white/10 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <UploadIcon className="h-10 w-10 text-sky-400" />
                </div>
                <p className="text-lg font-semibold text-white">
                    Drag & Drop images here
                </p>
                <p className="text-gray-400">
                    or <span className="text-sky-400 font-medium">click to browse</span>
                </p>
                <p className="text-xs text-gray-500">Supports: JPEG, PNG, WebP</p>
            </div>
        </div>
    );
};