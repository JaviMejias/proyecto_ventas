import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in-up"
        onClick={onClose}
        style={{ animationDuration: '0.3s' }}
      ></div>

      <div className="relative w-full max-w-2xl max-h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl flex flex-col animate-fade-in-up border border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50 rounded-t-[2rem]">
          <h3 className="text-2xl font-bold text-primary-500">
            {title}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-700/50 hover:text-slate-900 rounded-full p-2 inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white transition-all transform hover:rotate-90"
          >
            <X size={20} />
            <span className="sr-only">Cerrar modal</span>
          </button>
        </div>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
