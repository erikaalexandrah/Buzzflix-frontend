import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto border-x-2 border-t-2 border-ink bg-paper shadow-brutal-lg scrollbar-hide sm:max-h-[90vh] sm:border-2"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="b-border absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center bg-coral text-paper shadow-brutal-sm transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0
              111.414 1.414L11.414 10l4.293 4.293a1 1 0
              01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0
              01-1.414-1.414L8.586 10 4.293 5.707a1 1 0
              010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
