import React from 'react';
import { create } from 'zustand';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 4000;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'success', message, title, duration }),
  error: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'error', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'warning', message, title, duration }),
  info: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'info', message, title, duration }),
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';
        const isInfo = t.type === 'info';

        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5',
              isSuccess && 'bg-emerald-50/95 border-emerald-200 text-emerald-950',
              isError && 'bg-rose-50/95 border-rose-200 text-rose-950',
              isWarning && 'bg-amber-50/95 border-amber-200 text-amber-950',
              isInfo && 'bg-blue-50/95 border-blue-200 text-blue-950'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isInfo && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            <div className="flex-1 text-sm">
              {t.title && <div className="font-bold mb-0.5">{t.title}</div>}
              <div className="text-xs leading-relaxed opacity-90">{t.message}</div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

