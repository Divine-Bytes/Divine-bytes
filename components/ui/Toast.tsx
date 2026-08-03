'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const variantStyles: Record<ToastVariant, string> = {
    success: 'bg-deep-navy text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-dark-gray text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 md:px-0"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-body',
                'animate-slide-up',
                variantStyles[toast.variant]
              )}
            >
              <span className="flex-1">{toast.message}</span>
              <button
                aria-label="Dismiss notification"
                onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))}
                className="opacity-70 hover:opacity-100 transition-opacity shrink-0"
              >✕</button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
