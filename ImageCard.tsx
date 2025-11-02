
import React from 'react';
import { type ImageFile } from '../types';
import { DownloadIcon, EyeIcon, TrashIcon, SparklesIcon } from './icons/Icons';
import { formatBytes } from '../utils/fileUtils';

interface ImageCardProps {
    file: ImageFile;
    onPreview: () => void;
    onDelete: () => void;
}

const ImagePreview: React.FC<{ file: File }> = ({ file }) => {
    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!objectUrl) return <div className="w-full h-32 bg-gray-700 animate-pulse rounded-t-lg"></div>;

    return <img src={objectUrl} alt={file.name} className="w-full h-32 object-cover rounded-t-lg" />;
};


export const ImageCard: React.FC<ImageCardProps> = ({ file, onPreview, onDelete }) => {
    const { originalFile, originalSize, compressedBlob, compressedSize, status } = file;
    const savingPercentage = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

    const handleDownload = () => {
        if (compressedBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(compressedBlob);
            const nameParts = originalFile.name.split('.');
            const extension = nameParts.pop();
            link.download = `${nameParts.join('.')}-compressed.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    };
    
    return (
        <div className="relative glass-card rounded-xl overflow-hidden shadow-lg glow-border flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-sky-500/20">
            <ImagePreview file={originalFile} />
            
            {status === 'compressing' && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
                    <span>Compressing...</span>
                </div>
            )}
            {status === 'done' && compressedSize && savingPercentage > 0 && (
                 <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    <span>-{savingPercentage}%</span>
                </div>
            )}

            <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm font-medium text-white truncate" title={originalFile.name}>{originalFile.name}</p>
                    <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                       <span>{formatBytes(originalSize)}</span>
                       {status === 'done' && compressedSize && (
                           <span className="text-green-400 font-semibold">{formatBytes(compressedSize)}</span>
                       )}
                    </div>
                </div>
                
                <div className="mt-3 flex justify-center space-x-2">
                     <button onClick={onPreview} disabled={status !== 'done'} className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Preview">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownload} disabled={status !== 'done'} className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Download">
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onDelete} className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-white transition-colors" title="Delete">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};