import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { createTicket } from '../services/api';
import { CheckoutFormData } from '../services/api';
import { formatDate } from '../utils/formatters';
import { toast } from '../hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkoutData = location.state || null;

  useEffect(() => {
    if (!checkoutData) {
      navigate('/events');
    }
  }, [checkoutData, navigate]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setFormData({
        name: authState.user.name || '',
        email: authState.user.email || '',
        phone: authState.user.phone || '',
      });
    }
  }, [authState.isAuthenticated, authState.user]);

  const handleFormChange = (newData: Partial<CheckoutFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const calculateServiceFee = (subtotal: number): number => {
    const tangoPercentage = 1 + 5 / 100;
    const stripePercentage = 1 - 1.5 / 100;
    const priceWithTax = (subtotal * tangoPercentage + 0.25) / stripePercentage;
    const serviceFee = priceWithTax - subtotal;
    return Math.ceil(serviceFee * 100) / 100;
  };

  const handleSubmit = async () => {
    if (!checkoutData) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalQuantity = checkoutData.ticketDetails.reduce(
        (sum: number, ticket: any) => sum + ticket.quantity, 
        0
      );

      await createTicket(
        checkoutData.eventId,
        totalQuantity,
        formData
      );

      toast({
        title: "Purchase successful!",
        description: "Your tickets have been purchased successfully.",
      });

      navigate('/profile?tab=tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        variant: "destructive",
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const recalculateCheckoutData = () => {
    if (!checkoutData) return null;

    const subtotal = checkoutData.subtotal;
    const serviceFee = calculateServiceFee(subtotal);
    const total = subtotal + serviceFee;

    return {
      ...checkoutData,
      serviceFee,
      total
    };
  };

  const updatedCheckoutData = recalculateCheckoutData();

  const translations = {
    en: {
      title: 'Checkout',
      eventDetails: 'Event Details',
      date: 'Date',
      location: 'Location',
      ticketSummary: 'Ticket Summary',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      serviceFee: 'Service Fee',
      total: 'Total',
      personalInfo: 'Personal Information',
      payment: 'Payment',
      payWith: 'Pay with',
      goBack: 'Go Back',
      completePayment: 'Complete Payment',
      loginForFaster: 'Login for faster checkout',
      paymentNote: 'All transactions are secure and encrypted.'
    },
    es: {
      title: 'Pago',
      eventDetails: 'Detalles del Evento',
      date: 'Fecha',
      location: 'Ubicación',
      ticketSummary: 'Resumen de Entradas',
      quantity: 'Cantidad',
      price: 'Precio',
      subtotal: 'Subtotal',
      serviceFee: 'Cargo por servicio',
      total: 'Total',
      personalInfo: 'Información Personal',
      payment: 'Pago',
      payWith: 'Pagar con',
      goBack: 'Volver',
      completePayment: 'Completar Pago',
      loginForFaster: 'Inicia sesión para un pago más rápido',
      paymentNote: 'Todas las transacciones son seguras y encriptadas.'
    }
  };

  const t = translations[state.language];

  if (!updatedCheckoutData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tango-primary"></div>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.eventDetails}</h2>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <img 
                      src={updatedCheckoutData.eventImage || "https://source.unsplash.com/random/600x400/?concert"} 
                      alt={updatedCheckoutData.eventTitle} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-2/3 md:pl-4">
                    <h3 className="text-lg font-medium">{updatedCheckoutData.eventTitle}</h3>
                    <p className="text-gray-600 mb-2">{formatDate(updatedCheckoutData.eventDate || new Date().toISOString())}</p>
                    <p className="text-gray-600">{updatedCheckoutData.localName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.ticketSummary}</h2>
                <div className="divide-y">
                  {updatedCheckoutData.ticketDetails.map((ticket: any, index: number) => (
                    <div key={index} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{ticket.name || 'Regular Ticket'}</p>
                        <p className="text-sm text-gray-600">{t.quantity}: {ticket.quantity}</p>
                      </div>
                      <p className="font-medium">{(ticket.price * ticket.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>{t.subtotal}</span>
                    <span>{updatedCheckoutData.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>{t.serviceFee}</span>
                    <span>{updatedCheckoutData.serviceFee.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-3">
                    <span>{t.total}</span>
                    <span className="text-tango-primary">{updatedCheckoutData.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.personalInfo}</h2>
                
                {!authState.isAuthenticated && (
                  <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <a href="/auth?mode=login" className="font-medium underline">{t.loginForFaster}</a>
                  </div>
                )}
                
                <CheckoutForm 
                  data={formData} 
                  onChange={handleFormChange} 
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.payment}</h2>
                
                <div className="space-y-3">
                  <button className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <path d="M17.64 9.2c-.6-.46-1.06-.8-1.06-1.62 0-.85.74-1.45 1.36-1.45.36 0 .66.14.9.42l.1.1 1.16-1.14-.16-.18c-.62-.7-1.36-1.08-2.3-1.08-1.54 0-2.8 1.26-2.8 2.8 0 1.36.76 2.04 1.92 2.84.58.4 1.16.8 1.16 1.46 0 .66-.54 1.54-1.68 1.54-.86 0-1.5-.37-1.92-.95l-.12-.16-1.18 1.16.1.16c.76 1.1 1.7 1.54 2.9 1.54 2.98 0 3.48-1.86 3.48-2.76 0-1.36-.74-2.02-1.86-2.68zm-9.76 7.98l7.12-15.2-1.54-.72-7.1 15.18 1.52.74zm-3.22-6.76c.45.58 1.1.9 1.9.9 1.14 0 2.26-.76 2.26-2.5s-1.12-2.5-2.26-2.5c-.8 0-1.45.3-1.9.87l-.1.14V6.78h-1.85v8.7h1.86v-4.9l.1-.16z" fill="#fff" />
                    </svg>
                    Pay
                  </button>
                  
                  <button className="w-full py-3 bg-[#3b7bbf] text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="4" fill="#3b7bbf" />
                      <path d="M18.2 7.2H5.8c-.44 0-.8.36-.8.8v8c0 .44.36.8.8.8h12.4c.44 0 .8-.36.8-.8V8c0-.44-.36-.8-.8-.8zm-.4 8.4H6.2V8.4h11.6v7.2z" fill="white" />
                      <path d="M9.8 10.8c.66 0 1.2-.54 1.2-1.2 0-.66-.54-1.2-1.2-1.2-.66 0-1.2.54-1.2 1.2 0 .66.54 1.2 1.2 1.2z" fill="white" />
                      <path d="M9.8 15.6c.66 0 1.2-.54 1.2-1.2 0-.66-.54-1.2-1.2-1.2-.66 0-1.2.54-1.2 1.2 0 .66.54 1.2 1.2 1.2z" fill="white" />
                    </svg>
                    {t.payWith} PayPal
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    {t.paymentNote}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    t.completePayment
                  )}
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t.goBack}
                </button>
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
