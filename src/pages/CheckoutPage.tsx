
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { createTicket } from '../services/api';
import { CheckoutFormData } from '../types';
import { toast } from '../hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CardPaymentDialog from '../components/checkout/CardPaymentDialog';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import CheckoutSidebar from '../components/checkout/CheckoutSidebar';
import { useCheckoutCalculations } from '../hooks/useCheckoutCalculations';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, clearCart } = useApp();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  
  const checkoutData = location.state || null;
  const { recalculateCheckoutData } = useCheckoutCalculations();
  const updatedCheckoutData = recalculateCheckoutData(checkoutData);

  useEffect(() => {
    if (!checkoutData) {
      navigate('/events');
    }
  }, [checkoutData, navigate]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setFormData({
        name: authState.user.name || '',
        surname: '', // Add default empty surname
        email: authState.user.email || '',
        phone: authState.user.phone || '',
      });
    }
  }, [authState.isAuthenticated, authState.user]);

  const handleFormChange = (newData: Partial<CheckoutFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
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

      // Clear the cart after successful purchase
      clearCart();
      
      toast({
        title: "Purchase successful!",
        description: "Your tickets have been purchased successfully.",
      });

      // Close the dialog before navigating
      setShowCardDialog(false);
      
      // Add a small delay before navigating to ensure toast is shown
      setTimeout(() => {
        navigate('/profile?tab=tickets', { replace: true });
      }, 500);
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
      paymentNote: 'All transactions are secure and encrypted.',
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
      paymentNote: 'Todas las transacciones son seguras y encriptadas.',
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
            <CheckoutSummary 
              eventTitle={updatedCheckoutData.eventTitle}
              eventDate={updatedCheckoutData.eventDate}
              eventImage={updatedCheckoutData.eventImage || ""}
              localName={updatedCheckoutData.localName}
              ticketDetails={updatedCheckoutData.ticketDetails}
              subtotal={updatedCheckoutData.subtotal}
              serviceFee={updatedCheckoutData.serviceFee}
              total={updatedCheckoutData.total}
              translations={{
                eventDetails: t.eventDetails,
                date: t.date,
                location: t.location,
                ticketSummary: t.ticketSummary,
                quantity: t.quantity,
                price: t.price,
                subtotal: t.subtotal,
                serviceFee: t.serviceFee,
                total: t.total
              }}
            />

            <CheckoutSidebar 
              isAuthenticated={authState.isAuthenticated}
              formData={formData}
              handleFormChange={handleFormChange}
              openPaymentDialog={() => setShowCardDialog(true)}
              goBack={() => navigate(-1)}
              isSubmitting={isSubmitting}
              translations={{
                personalInfo: t.personalInfo,
                payment: t.payment,
                payWith: t.payWith,
                goBack: t.goBack,
                completePayment: t.completePayment,
                loginForFaster: t.loginForFaster,
                paymentNote: t.paymentNote
              }}
            />
          </div>
        </motion.div>
      </div>
      <CardPaymentDialog 
        open={showCardDialog}
        onOpenChange={setShowCardDialog}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        total={updatedCheckoutData.total}
        language={state.language}
      />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
