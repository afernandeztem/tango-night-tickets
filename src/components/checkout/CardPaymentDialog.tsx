
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import './CardPaymentDialog.scss';

interface CardPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  total: number;
  language: 'en' | 'es';
}

const CardPaymentDialog: React.FC<CardPaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting,
  total,
  language 
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formattedValue = value
      .replace(/(\d{4})/g, '$1 ')
      .trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      // Format as MM / YY
      setExpiryDate(value.substring(0, 2) + ' / ' + value.substring(2, 4));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvc(value);
  };

  const t = {
    en: {
      cardInfo: 'Card information',
      cardNumber: 'Card number',
      expiryDate: 'MM / YY',
      cvc: 'CVC',
      scanCard: 'Scan card',
      billingAddress: 'Billing address',
      country: 'Country or region',
      pay: 'Pay',
      payWithCard: 'Or pay with a card'
    },
    es: {
      cardInfo: 'Información de tarjeta',
      cardNumber: 'Número de tarjeta',
      expiryDate: 'MM / AA',
      cvc: 'CVC',
      scanCard: 'Escanear tarjeta',
      billingAddress: 'Dirección de facturación',
      country: 'País o región',
      pay: 'Pagar',
      payWithCard: 'O pagar con tarjeta'
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-payment-dialog__content sm:max-w-md p-0 overflow-hidden bg-[#9d92d8]">
        <DialogTitle className="sr-only">Card Payment</DialogTitle>
        <div className="p-4 sm:p-6 bg-white mt-2 rounded-t-xl">
          <div className="mb-6">
            <button className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple Pay
            </button>
          </div>
          
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-3 text-gray-500">{t[language].payWithCard}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="card-payment-dialog__form mt-4">
            <p className="text-gray-600 mb-2">{t[language].cardInfo}</p>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t[language].cardNumber}
                className="card-payment-dialog__form-input w-full p-3 border border-gray-300 rounded"
                maxLength={19}
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t[language].expiryDate}
                  className="card-payment-dialog__form-input w-full p-3 border border-gray-300 rounded"
                  maxLength={7}
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="CVC"
                  className="card-payment-dialog__form-input w-full p-3 border border-gray-300 rounded"
                  maxLength={4}
                  value={cvc}
                  onChange={handleCvcChange}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">{t[language].billingAddress}</p>
              <div className="relative">
                <select className="card-payment-dialog__form-input w-full p-3 border border-gray-300 rounded appearance-none">
                  <option>Spain</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>France</option>
                  <option>Germany</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onSubmit}
              disabled={isSubmitting}
              className="card-payment-dialog__form-submit w-full py-3 mt-4 bg-[#d63384] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="spinner -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `${language === 'en' ? 'Pay' : 'Pagar'} ${total.toFixed(2)} €`
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentDialog;
