
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../common/LoadingSpinner';

declare global {
  interface Window {
    Square: any; 
  }
}

interface SquarePaymentFormProps {
  applicationId: string;
  locationId: string;
  onCardNonceResponseReceived: (
    nonce: string, 
    verificationToken?: string,
    buyerVerificationToken?: string 
  ) => void;
  formId?: string;
  buttonText?: string;
  priceDisplay: string; 
  chargeAmount: string; // Actual amount to charge, e.g., "29.99"
  currencyCode: string; // e.g., "USD"
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  applicationId,
  locationId,
  onCardNonceResponseReceived,
  formId = "card-container",
  buttonText, 
  priceDisplay,
  chargeAmount,
  currencyCode,
}) => {
  const { t } = useTranslation();
  const [card, setCard] = useState<any>(null);
  const paymentsRef = useRef<any>(null); // To store the payments object
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!applicationId || !locationId || applicationId === 'YOUR_SQUARE_SANDBOX_APPLICATION_ID' || locationId === 'YOUR_SQUARE_SANDBOX_LOCATION_ID') {
      setErrorMessage(t('pricing.paymentModal.errorSquareIdsMissing'));
      return;
    }
    
    if (!window.Square) {
      setErrorMessage(t('pricing.paymentModal.errorSquareSDK'));
      console.error("Square Web Payments SDK not loaded");
      return;
    }

    const initializeCard = async () => {
      try {
        if (!paymentsRef.current) { // Initialize payments only once
          paymentsRef.current = window.Square.payments(applicationId, locationId);
        }
        const cardInstance = await paymentsRef.current.card();
        
        if (cardContainerRef.current && cardContainerRef.current.childElementCount === 0) {
            await cardInstance.attach(`#${formId}`);
            setCard(cardInstance);
            setErrorMessage(null); 
        } else if (!cardContainerRef.current) {
            console.error("Card container ref is not available.");
             setErrorMessage(t('pricing.paymentModal.errorInitCardForm'));
        }

      } catch (e) {
        console.error("Error initializing Square card form:", e);
        setErrorMessage(t('pricing.paymentModal.errorInitCardForm') + `: ${e instanceof Error ? e.message : String(e)}`);
      }
    };

    initializeCard();

  }, [applicationId, locationId, formId, t]);

  const handlePayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!card || !paymentsRef.current) {
      setErrorMessage(t('pricing.paymentModal.errorCardNotReady'));
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const tokenizeResult = await card.tokenize();
      if (tokenizeResult.status === 'OK' && tokenizeResult.token) {
        if (tokenizeResult.verificationToken) {
          // SCA flow: verificationToken is present, need to call verifyBuyer
          setErrorMessage(t('pricing.paymentModal.verifyingPayment')); // Info message
          const verificationDetails = {
            amount: chargeAmount,
            currencyCode: currencyCode,
            intent: 'CHARGE', // Assuming direct charge
            // billingContact: {} // Optional: Add billing contact details if available
          };
          try {
            const verifyBuyerResult = await paymentsRef.current.verifyBuyer(
              tokenizeResult.token, // This is the nonce
              verificationDetails
            );
            // verifyBuyerResult.token is the same nonce if successful
            // verifyBuyerResult.buyerVerificationToken is the token from SCA
            onCardNonceResponseReceived(tokenizeResult.token, tokenizeResult.verificationToken, verifyBuyerResult.token);
          } catch (verifyError: any) {
            console.error("Error during verifyBuyer:", verifyError);
            let verifyErrorMessage = t('pricing.paymentModal.errorVerificationFailed');
            if (verifyError.message) {
                verifyErrorMessage += `: ${verifyError.message}`;
            } else if (typeof verifyError === 'string') {
                verifyErrorMessage += `: ${verifyError}`;
            }
            setErrorMessage(verifyErrorMessage);
          }
        } else {
          // No SCA required, directly use the nonce
          onCardNonceResponseReceived(tokenizeResult.token, undefined, undefined);
        }
      } else {
        let detailedError = t('pricing.paymentModal.errorTokenizationFailed');
        if (tokenizeResult.errors && tokenizeResult.errors.length > 0) {
            detailedError += `: ${tokenizeResult.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')}`;
        }
        setErrorMessage(detailedError);
        console.error("Tokenization error:", tokenizeResult.errors);
      }
    } catch (e) {
      console.error("Error tokenizing card:", e);
      setErrorMessage(t('pricing.paymentModal.errorTokenizationGeneric') + `: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div id={formId} ref={cardContainerRef} className="border border-input rounded-lg p-3 bg-input">
        {/* Square Card Form will be injected here */}
      </div>
      {errorMessage && (
        <p className={`text-sm p-2.5 rounded-md text-center ${errorMessage === t('pricing.paymentModal.verifyingPayment') ? 'text-primary bg-primary/10 border border-primary/30' : 'text-destructive-foreground bg-destructive/50 border border-destructive'}`}>{errorMessage}</p>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading || !card || !!errorMessage && errorMessage === t('pricing.paymentModal.errorSquareIdsMissing') }
        className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
      >
        {isLoading ? <LoadingSpinner /> : (buttonText || t('pricing.paymentModal.submitPaymentButton', { price: priceDisplay }))}
      </button>
    </div>
  );
};

export default SquarePaymentForm;
