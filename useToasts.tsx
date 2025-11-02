
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { type Toast } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../components/icons/Icons';

let toastId = 0;

const ToastComponent: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    const colors = {
        success: 'bg-green-500/80 border-green-400',
        error: 'bg-red-500/80 border-red-400',
        info: 'bg-sky-500/80 border-sky-400',
    };

    const icons = {
        success: <CheckCircleIcon className="w-6 h-6" />,
        error: <XCircleIcon className="w-6 h-6" />,
        info: <InformationCircleIcon className="w-6 h-6" />,
    }

    return (
        <div
            className={`flex items-center p-3 rounded-lg shadow-lg text-white text-sm font-medium border glass-card animate-fade-in-right ${colors[toast.type]}`}
        >
            <div className="mr-3">{icons[toast.type]}</div>
            {toast.message}
        </div>
    );
};

export const useToasts = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = toastId++;
        setToasts(currentToasts => [...currentToasts, { id, ...toast }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, []);

    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
        ReactDOM.createPortal(
            toasts.map(toast => (
                <ToastComponent key={toast.id} toast={toast} onDismiss={removeToast} />
            )),
            toastContainer
        );
    }
    
    return { addToast };
};