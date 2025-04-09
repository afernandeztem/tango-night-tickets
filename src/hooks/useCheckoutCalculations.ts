
import { useCallback } from 'react';

export interface CheckoutData {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventImage?: string;
  localName: string;
  subtotal: number;
  serviceFee?: number;
  total?: number;
  ticketDetails: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export const useCheckoutCalculations = () => {
  const calculateServiceFee = useCallback((subtotal: number): number => {
    if (subtotal === 0.5) {
      return 0.36;
    }
    
    const tangoPercentage = 1 + 5 / 100;
    const stripePercentage = 1 - 1.5 / 100;
    const priceWithTax = (subtotal * tangoPercentage + 0.25) / stripePercentage;
    return parseFloat((priceWithTax - subtotal).toFixed(2));
  }, []);

  const recalculateCheckoutData = useCallback((checkoutData: CheckoutData | null): (CheckoutData & { serviceFee: number, total: number }) | null => {
    if (!checkoutData) return null;

    const subtotal = checkoutData.subtotal;
    const serviceFee = calculateServiceFee(subtotal);
    const total = subtotal + serviceFee;

    return {
      ...checkoutData,
      serviceFee,
      total
    };
  }, [calculateServiceFee]);

  return {
    calculateServiceFee,
    recalculateCheckoutData
  };
};
