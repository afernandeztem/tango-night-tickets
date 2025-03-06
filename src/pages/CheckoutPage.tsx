
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';
import TicketCard from '../components/TicketCard';
import { useToast } from '../hooks/use-toast';

type CheckoutData = {
  eventId: string;
  eventTitle: string;
  quantity: number;
  price: number;
  total: number;
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Get checkout data from location state
  const checkoutData = location.state as CheckoutData;
  
  if (!checkoutData || !checkoutData.eventId) {
    // Redirect if no event data
    navigate('/events');
    return null;
  }
  
  const translations = {
    en: {
      checkout: 'Checkout',
      orderSummary: 'Order Summary',
      event: 'Event',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      paymentInfo: 'Payment Information',
      processingOrder: 'Processing your order...',
      successTitle: 'Purchase Successful!',
      successMessage: 'Your tickets have been confirmed. You will receive details via email.',
      downloadApp: 'Download the TangoApp to easily access your tickets!',
      continueButton: 'Continue Shopping',
      profileButton: 'Go to Profile',
      payNow: 'Pay Now',
      yourInformation: 'Your Information'
    },
    es: {
      checkout: 'Finalizar compra',
      orderSummary: 'Resumen del pedido',
      event: 'Evento',
      quantity: 'Cantidad',
      price: 'Precio',
      total: 'Total',
      paymentInfo: 'Información de pago',
      processingOrder: 'Procesando tu pedido...',
      successTitle: '¡Compra exitosa!',
      successMessage: 'Tus entradas han sido confirmadas. Recibirás los detalles por correo electrónico.',
      downloadApp: '¡Descarga TangoApp para acceder fácilmente a tus entradas!',
      continueButton: 'Continuar comprando',
      profileButton: 'Ir al perfil',
      payNow: 'Pagar ahora',
      yourInformation: 'Tu información'
    }
  };
  
  const t = translations[state.language];
  
  const handleSubmitOrder = (formData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      toast({
        title: t.successTitle,
        description: t.successMessage,
        variant: "default",
      });
    }, 2000);
  };
  
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{t.successTitle}</h1>
            <p className="text-gray-600 mb-6">{t.successMessage}</p>
            
            <div className="mb-6">
              <TicketCard 
                event={{
                  id: checkoutData.eventId,
                  title: checkoutData.eventTitle,
                  price: checkoutData.price,
                  quantity: checkoutData.quantity,
                  date: new Date().toISOString() // Placeholder
                }}
              />
            </div>
            
            <p className="text-tango-primary font-medium mb-8">{t.downloadApp}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.continueButton}
              </button>
              
              {authState.isAuthenticated ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {t.profileButton}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth?mode=register')}
                  className="px-6 py-3 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Register
                </button>
              )}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center">{t.checkout}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.orderSummary}</h2>
              
              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium">{t.event}</div>
                    <div className="font-medium text-center">{t.quantity}</div>
                    <div className="font-medium text-right">{t.price}</div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="truncate">{checkoutData.eventTitle}</div>
                    <div className="text-center">{checkoutData.quantity}</div>
                    <div className="text-right">{checkoutData.price.toFixed(2)} €</div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>{t.total}</span>
                      <span className="text-tango-primary">{checkoutData.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">{t.yourInformation}</h2>
              
              <div className="border rounded-lg p-6">
                <CheckoutForm 
                  onSubmit={handleSubmitOrder}
                  isSubmitting={isSubmitting}
                  buttonText={isSubmitting ? t.processingOrder : t.payNow}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
