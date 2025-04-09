
import React from 'react';
import CheckoutForm from '../CheckoutForm';
import { CheckoutFormData } from '../../types';
import './CheckoutSidebar.scss';

interface CheckoutSidebarProps {
  isAuthenticated: boolean;
  formData: CheckoutFormData;
  handleFormChange: (data: Partial<CheckoutFormData>) => void;
  openPaymentDialog: () => void;
  goBack: () => void;
  isSubmitting: boolean;
  translations: {
    personalInfo: string;
    payment: string;
    payWith: string;
    goBack: string;
    completePayment: string;
    loginForFaster: string;
    paymentNote: string;
  };
}

const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
  isAuthenticated,
  formData,
  handleFormChange,
  openPaymentDialog,
  goBack,
  isSubmitting,
  translations: t
}) => {
  return (
    <div className="checkout-sidebar lg:col-span-1 space-y-6">
      <div className="checkout-sidebar__section bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.personalInfo}</h2>
        
        {!isAuthenticated && (
          <div className="checkout-sidebar__info-box mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            <a href="/auth?mode=login" className="font-medium underline">{t.loginForFaster}</a>
          </div>
        )}
        
        <CheckoutForm 
          data={formData} 
          onChange={handleFormChange} 
          disabled={isSubmitting}
        />
      </div>

      <div className="checkout-sidebar__section bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.payment}</h2>
        
        <div className="space-y-3">
          <button 
            onClick={openPaymentDialog}
            className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Apple Pay
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            {t.paymentNote}
          </p>
        </div>
      </div>
      
      <button
        onClick={openPaymentDialog}
        className="checkout-sidebar__button--primary w-full py-3 bg-[#d63384] text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        {t.completePayment}
      </button>
      
      <button
        onClick={goBack}
        className="checkout-sidebar__button--secondary w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {t.goBack}
      </button>
    </div>
  );
};

export default CheckoutSidebar;
