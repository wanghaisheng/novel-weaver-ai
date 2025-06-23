
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import SquarePaymentForm from './SquarePaymentForm';
import { SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID } from '../../constants'; // Import placeholder IDs

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  priceDisplay: string; // e.g., "$29.99 / month"
  currencyCode: string; // e.g., "USD" - for SCA
  chargeAmount: string; // e.g., "29.99" - for SCA
  onPaymentSuccess: (
    nonce: string, 
    verificationToken?: string,
    buyerVerificationToken?: string
  ) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planName,
  priceDisplay,
  currencyCode,
  chargeAmount,
  onPaymentSuccess,
}) => {
  const { t } = useTranslation();

  const handleNonceReceived = (
    nonce: string, 
    verificationToken?: string,
    buyerVerificationToken?: string
  ) => {
    onPaymentSuccess(nonce, verificationToken, buyerVerificationToken);
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={t('pricing.paymentModal.title', { planName })}
    >
      <div className="space-y-4">
        <p className="text-center text-lg text-foreground">
          {t('pricing.paymentModal.youArePayingFor')}: <strong className="text-primary">{planName}</strong>
        </p>
        <p className="text-center text-2xl font-bold text-foreground mb-6">
          {priceDisplay}
        </p>
        
        <SquarePaymentForm
          applicationId={SQUARE_APPLICATION_ID}
          locationId={SQUARE_LOCATION_ID}
          onCardNonceResponseReceived={handleNonceReceived}
          priceDisplay={priceDisplay} // Still used for button text fallback
          chargeAmount={chargeAmount} // New prop for SCA
          currencyCode={currencyCode}   // New prop for SCA
        />
        <p className="text-xs text-muted-foreground text-center pt-2">
          {t('pricing.paymentModal.securityNote')}
        </p>
      </div>
    </Modal>
  );
};

export default PaymentModal;
