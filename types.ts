
export type CompressionStatus = 'idle' | 'compressing' | 'done' | 'error';

export interface ImageFile {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number | null;
  status: CompressionStatus;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}