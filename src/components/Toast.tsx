import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ToastMessage } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const config = {
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
      barBg: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300',
      icon: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
      barBg: 'bg-rose-500',
    },
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-800 dark:text-indigo-300',
      icon: <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />,
      barBg: 'bg-indigo-500',
    },
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg shadow-black/5 ${config.bg}`}
    >
      {config.icon}
      <div className="flex-1 text-sm font-medium pr-2 leading-tight">
        {toast.message}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-500/10 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Visual countdown progress line */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${config.barBg}`}
      />
    </motion.div>
  );
};
