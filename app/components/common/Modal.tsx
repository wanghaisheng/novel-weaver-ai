

import React, { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-card p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg relative text-foreground border border-border transform transition-all duration-300 scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()} 
        style={{ animationName: 'modalAppearKeyframes', animationDuration: '0.3s', animationFillMode: 'forwards' }}
      >
         <style>
          {`
            @keyframes modalAppearKeyframes {
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
        {title && (
          <h2 className="text-2xl font-bold text-primary mb-6 text-center tracking-tight">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};