
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { createTicket } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';

interface LocationState {
  eventId: string;
  eventTitle: string;
  quantity: number;
  price: number;
  total: number;
}

const CheckoutPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const { state: authState } = useAuth();
  const { state: appState } = useApp();
  const navigate = useNavigate();
  
  // Get event info from location state
  const eventInfo = location.state as LocationState;
  
  if (!eventInfo || !eventInfo.eventId) {
    // Redirect if no event info
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
      payment: 'Payment Method',
      paymentInfo: 'Payment information',
      cardInfo: 'Please enter your payment information',
      userInfo: 'Your Information',
      userInfoDesc: 'Please enter your details',
      submitPayment: 'Complete Purchase',
      processing: 'Processing...',
      successTitle: 'Purchase Successful!',
      successMessage: 'Your ticket has been reserved.',
      downloadApp: 'For easy access to your tickets, consider downloading the TangoApp mobile application.',
      backToEvents: 'Back to Events',
      viewTickets: 'View My Tickets'
    },
    es: {
      checkout: 'Finalizar Compra',
      orderSummary: 'Resumen del Pedido',
      event: 'Evento',
      quantity: 'Cantidad',
      price: 'Precio',
      total: 'Total',
      payment: 'Método de Pago',
      paymentInfo: 'Información de pago',
      cardInfo: 'Por favor, introduce tu información de pago',
      userInfo: 'Tu Información',
      userInfoDesc: 'Por favor, ingresa tus datos',
      submitPayment: 'Completar Compra',
      processing: 'Procesando...',
      successTitle: '¡Compra Exitosa!',
      successMessage: 'Tu entrada ha sido reservada.',
      downloadApp: 'Para acceder fácilmente a tus entradas, considera descargar la aplicación móvil TangoApp.',
      backToEvents: 'Volver a Eventos',
      viewTickets: 'Ver Mis Entradas'
    }
  };
  
  const t = translations[appState.language];
  
  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Create ticket
      await createTicket(eventInfo.eventId, eventInfo.quantity, formData);
      
      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state while waiting for eventInfo
  if (!eventInfo) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{t.successTitle}</h1>
            <p className="text-xl text-gray-600 mb-2">{t.successMessage}</p>
            <p className="text-gray-500 mb-8">{t.downloadApp}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.backToEvents}
              </button>
              
              {authState.isAuthenticated && (
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {t.viewTickets}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <CheckoutForm 
                onSubmit={handleSubmit}
                buttonText={isSubmitting ? t.processing : t.submitPayment}
              />
            </div>
            
            <div>
              <div className="bg-gray-50 border rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ShoppingCart size={20} className="mr-2 text-tango-primary" />
                  {t.orderSummary}
                </h2>
                
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.event}</span>
                    <span>{eventInfo.eventTitle}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>{t.quantity}</span>
                    <span>{eventInfo.quantity}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>{t.price}</span>
                    <span>{eventInfo.price.toFixed(2)} €</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t.total}</span>
                    <span className="text-tango-primary">{eventInfo.total.toFixed(2)} €</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium flex items-center mb-2">
                    <CreditCard size={18} className="mr-2 text-tango-primary" />
                    {t.payment}
                  </h3>
                  <p className="text-sm text-gray-500">{t.cardInfo}</p>
                </div>
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
