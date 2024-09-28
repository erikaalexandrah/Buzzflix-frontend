import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto bg-[#181818] rounded-md shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
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
        <div className="flex flex-col items-center justify-center p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
