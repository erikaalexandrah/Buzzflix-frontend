import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-ink bg-paper shadow-brutal-lg scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
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
