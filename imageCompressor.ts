
export const compressImage = (file: File, quality: number, isLossless: boolean): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // For lossless PNG, only return if smaller than original.
                            if (isLossless && file.type === 'image/png' && blob.size >= file.size) {
                                resolve(file);
                            } else {
                                resolve(blob);
                            }
                        } else {
                            reject(new Error('Canvas toBlob returned null'));
                        }
                    },
                    mimeType,
                    quality
                );
            };
            img.onerror = (error) => {
                reject(error);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};