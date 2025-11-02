
import { type ImageFile } from '../types';

// This relies on the JSZip script being loaded in index.html
declare const JSZip: any;

export const downloadZip = async (files: ImageFile[]): Promise<void> => {
    const zip = new JSZip();

    files.forEach(file => {
        if (file.compressedBlob) {
            const nameParts = file.originalFile.name.split('.');
            const extension = nameParts.pop();
            const newName = `${nameParts.join('.')}-compressed.${extension}`;
            zip.file(newName, file.compressedBlob);
        }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `PixPress_Compressed_${new Date().toISOString().slice(0,10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};