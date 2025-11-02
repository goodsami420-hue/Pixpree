
import React, { useState, useCallback, useEffect } from 'react';
import { type ImageFile, type CompressionStatus } from './types';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ImageGrid } from './components/ImageGrid';
import { BottomBar } from './components/BottomBar';
import { AboutModal } from './components/AboutModal';
import { PreviewModal } from './components/PreviewModal';
import { useToasts } from './hooks/useToasts';
import { compressImage } from './services/imageCompressor';
import { downloadZip } from './services/zipService';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [quality, setQuality] = useState<number>(80);
    const [isLossless, setIsLossless] = useState<boolean>(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
    const [previewFile, setPreviewFile] = useState<ImageFile | null>(null);
    const [totalOriginalSize, setTotalOriginalSize] = useState<number>(0);
    const [totalCompressedSize, setTotalCompressedSize] = useState<number>(0);

    const { addToast } = useToasts();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    useEffect(() => {
        const original = files.reduce((acc, file) => acc + file.originalSize, 0);
        const compressed = files.reduce((acc, file) => acc + (file.compressedSize || 0), 0);
        setTotalOriginalSize(original);
        setTotalCompressedSize(compressed);
    }, [files]);
    
    const handleFileChange = (newFiles: File[]) => {
        const imageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
        const newImageFiles: ImageFile[] = imageFiles.map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            originalFile: file,
            originalSize: file.size,
            compressedBlob: null,
            compressedSize: null,
            status: 'idle',
        }));
        setFiles(prev => [...prev, ...newImageFiles]);
        if (imageFiles.length > 0) {
            addToast({ message: `${imageFiles.length} image(s) added.`, type: 'success' });
        } else if (newFiles.length > 0) {
            addToast({ message: 'Only image files are supported.', type: 'error' });
        }
    };

    const updateFileStatus = (id: string, status: CompressionStatus, compressedData?: { blob: Blob, size: number }) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    status,
                    compressedBlob: compressedData?.blob ?? f.compressedBlob,
                    compressedSize: compressedData?.size ?? f.compressedSize,
                };
            }
            return f;
        }));
    };

    const handleCompressAll = useCallback(async () => {
        const filesToCompress = files.filter(f => f.status === 'idle' || f.status === 'done');
        if (filesToCompress.length === 0) {
            addToast({ message: 'No new images to compress.', type: 'info' });
            return;
        }

        addToast({ message: `Compressing ${filesToCompress.length} images...`, type: 'info' });

        const effectiveQuality = isLossless ? 100 : quality;

        const promises = filesToCompress.map(async file => {
            updateFileStatus(file.id, 'compressing');
            try {
                const compressedBlob = await compressImage(file.originalFile, effectiveQuality / 100, isLossless);
                updateFileStatus(file.id, 'done', { blob: compressedBlob, size: compressedBlob.size });
            } catch (error) {
                console.error(`Failed to compress ${file.originalFile.name}:`, error);
                updateFileStatus(file.id, 'error');
            }
        });
        
        await Promise.all(promises);
        addToast({ message: 'Compression complete!', type: 'success' });
    }, [files, quality, isLossless, addToast]);

    const handleRecompress = useCallback(async (file: ImageFile) => {
        if (!file) return;
        updateFileStatus(file.id, 'compressing');
        try {
            const effectiveQuality = isLossless ? 100 : quality;
            const compressedBlob = await compressImage(file.originalFile, effectiveQuality / 100, isLossless);
            const updatedFile = {
                 ...file,
                 status: 'done' as CompressionStatus,
                 compressedBlob: compressedBlob,
                 compressedSize: compressedBlob.size,
            }
            setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
            setPreviewFile(updatedFile); // Update preview modal
            addToast({ message: `${file.originalFile.name} recompressed.`, type: 'success' });
        } catch (error) {
             console.error(`Failed to recompress ${file.originalFile.name}:`, error);
             updateFileStatus(file.id, 'error');
             addToast({ message: `Failed to recompress.`, type: 'error' });
        }
    }, [quality, isLossless, addToast]);

    const handleDelete = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        addToast({ message: 'Image removed.', type: 'info' });
    };

    const handleClearAll = () => {
        setFiles([]);
        addToast({ message: 'All images cleared.', type: 'info' });
    };

    const handleDownloadAll = async () => {
        const compressedFiles = files.filter(f => f.status === 'done' && f.compressedBlob);
        if (compressedFiles.length === 0) {
            addToast({ message: 'No compressed images to download.', type: 'error' });
            return;
        }
        try {
            addToast({ message: 'Preparing ZIP file...', type: 'info' });
            await downloadZip(compressedFiles);
            addToast({ message: 'ZIP download started.', type: 'success' });
        } catch (error) {
            console.error('Failed to create ZIP:', error);
            addToast({ message: 'Failed to create ZIP file.', type: 'error' });
        }
    };
    
    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/bg/1920/1080')"}}>
           <div className="min-h-screen w-full bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300">
             <Header onAboutClick={() => setAboutModalOpen(true)} onThemeToggle={toggleTheme} theme={theme} />
            <main className="container mx-auto px-4 py-8 pt-24 pb-32 md:pb-16">
                <UploadZone onFileChange={handleFileChange} />
                
                <ImageGrid
                    files={files}
                    onPreview={setPreviewFile}
                    onDelete={handleDelete}
                    quality={quality}
                    setQuality={setQuality}
                    isLossless={isLossless}
                    setIsLossless={setIsLossless}
                    onCompressAll={handleCompressAll}
                    onClearAll={handleClearAll}
                    onDownloadAll={handleDownloadAll}
                />
            </main>

            <BottomBar
                quality={quality}
                setQuality={setQuality}
                isLossless={isLossless}
                setIsLossless={setIsLossless}
                onCompressAll={handleCompressAll}
                totalOriginalSize={totalOriginalSize}
                totalCompressedSize={totalCompressedSize}
            />

            {isAboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
            {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} onRecompress={handleRecompress} />}
          </div>
        </div>
    );
};

export default App;