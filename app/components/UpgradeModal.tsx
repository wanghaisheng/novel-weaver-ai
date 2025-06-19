

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
        <p className="text-lg text-foreground">
          You've used all your <strong className="text-primary">3 free novel downloads</strong>.
        </p>
        <p className="text-muted-foreground">
          To continue downloading your work and unlock unlimited access plus other premium features, please sign in or upgrade your plan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={onUpgradeClick} // Use the new prop
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            Sign In / Upgrade
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;