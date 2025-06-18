
import React from 'react';
import { Modal } from './common/Modal'; 

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void; // New prop
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgradeClick }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Free Limit Reached">
      <div className="text-center space-y-6">
        <p className="text-lg text-slate-200">
          You've used all your <strong className="text-sky-400">3 free novel downloads</strong>.
        </p>
        <p className="text-slate-300">
          To continue downloading your work and unlock unlimited access plus other premium features, please sign in or upgrade your plan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={onUpgradeClick} // Use the new prop
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            Sign In / Upgrade
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
