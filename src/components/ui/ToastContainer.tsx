import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        };

        const bgColors = {
          success: 'bg-emerald-50/90 border-emerald-200',
          error: 'bg-rose-50/90 border-rose-200',
          info: 'bg-sky-50/90 border-sky-200',
          warning: 'bg-amber-50/90 border-amber-200',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto clay-card p-4 flex items-start gap-3 border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-slate-800">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
