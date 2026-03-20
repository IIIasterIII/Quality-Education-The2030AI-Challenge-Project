import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { cn } from "@workspace/ui/lib/utils";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]",
    error: "bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]",
    info: "bg-sky-500/10 border-sky-500/20 shadow-[0_0_15px_-5px_rgba(14,165,233,0.3)]",
    warning: "bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto",
        bgColors[type]
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium text-foreground/90">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="ml-2 p-1 hover:bg-foreground/10 rounded-full transition-colors opacity-60 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
    const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const ToastComponent = (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id}>
                    <Toast id={toast.id} message={toast.message} type={toast.type} onClose={removeToast} />
                </div>
            ))}
        </div>
    );

    return { showToast, ToastComponent };
};
