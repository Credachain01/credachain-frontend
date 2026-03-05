'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error:   <XCircle size={16} className="text-red-500" />,
  warning: <AlertTriangle size={16} className="text-orange-500" />,
  info:    <Info size={16} className="text-blue-500" />,
};

const borders = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  warning: 'border-l-orange-500',
  info:    'border-l-[#4169E1]',
};

function ToastItem({ id, message, type }: { id: string; message: string; type: 'success'|'error'|'warning'|'info' }) {
  const removeToast = useAppStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(t);
  }, [id, removeToast]);

  return (
    <div className={`flex items-start gap-3 bg-white rounded-xl shadow-lg border border-slate-100 border-l-4 ${borders[type]} px-4 py-3 min-w-[280px] max-w-sm animate-[slideIn_0.3s_ease-out]`}>
      <span className="mt-0.5 flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm text-slate-700 font-medium">{message}</p>
      <button onClick={() => removeToast(id)} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastProvider() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
