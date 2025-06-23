

import React from 'react';
import { Modal } from './common/Modal'; 
import { useTranslation } from 'react-i18next';


interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgradeClick }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('upgradeModal.title')}>
      <div className="text-center space-y-6">
        <p className="text-lg text-foreground">
          {t('upgradeModal.description')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            onClick={onUpgradeClick}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {t('upgradeModal.cta')}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-accent text-foreground hover:text-accent-foreground font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {t('upgradeModal.later')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;