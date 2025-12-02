import type React from 'react';
import { useEffect } from 'react';

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {title && (
            <div className="px-6 py-3 border-b">
              <h3 className="text-lg font-medium">{title}</h3>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
