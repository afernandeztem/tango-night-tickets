
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { createTicket } from '../services/api';
import { CheckoutFormData } from '../services/api';
import { formatDate } from '../utils/formatters';
import { toast } from '../hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, clearCart } = useApp();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

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
    if (subtotal === 0.5) {
      return 0.36;
    }
    
    const tangoPercentage = 1 + 5 / 100;
    const stripePercentage = 1 - 1.5 / 100;
    const priceWithTax = (subtotal * tangoPercentage + 0.25) / stripePercentage;
    return parseFloat((priceWithTax - subtotal).toFixed(2));
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
      paymentNote: 'All transactions are secure and encrypted.',
      payWithCard: 'Or pay with a card',
      cardInfo: 'Card information',
      cardNumber: 'Card number',
      expiryDate: 'MM / YY',
      cvc: 'CVC',
      scanCard: 'Scan card',
      billingAddress: 'Billing address',
      country: 'Country or region',
      pay: 'Pay'
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
      payWithCard: 'O pagar con tarjeta',
      cardInfo: 'Información de tarjeta',
      cardNumber: 'Número de tarjeta',
      expiryDate: 'MM / AA',
      cvc: 'CVC',
      scanCard: 'Escanear tarjeta',
      billingAddress: 'Dirección de facturación',
      country: 'País o región',
      pay: 'Pagar'
    }
  };

  const t = translations[state.language];

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

  const CardPaymentDialog = () => (
    <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-[#9d92d8]">
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
            <span className="flex-shrink mx-3 text-gray-500">{state.language === 'en' ? 'Or pay with a card' : 'O pagar con tarjeta'}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600 mb-2">{state.language === 'en' ? 'Card information' : 'Información de tarjeta'}</p>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={state.language === 'en' ? 'Card number' : 'Número de tarjeta'}
                className="w-full p-3 border border-gray-300 rounded"
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
                  placeholder={state.language === 'en' ? 'MM / YY' : 'MM / AA'}
                  className="w-full p-3 border border-gray-300 rounded"
                  maxLength={7}
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full p-3 border border-gray-300 rounded"
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
              <p className="text-gray-600 mb-2">{state.language === 'en' ? 'Billing address' : 'Dirección de facturación'}</p>
              <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded appearance-none">
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-[#d63384] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
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
                `${state.language === 'en' ? 'Pay' : 'Pagar'} ${updatedCheckoutData?.total.toFixed(2)} €`
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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
                  <button 
                    onClick={() => setShowCardDialog(true)}
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
                onClick={() => setShowCardDialog(true)}
                className="w-full py-3 bg-[#d63384] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {t.completePayment}
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t.goBack}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <CardPaymentDialog />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
