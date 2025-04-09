
import React from 'react';
import { formatDate } from '../../utils/formatters';

interface TicketDetail {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutSummaryProps {
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  localName: string;
  ticketDetails: TicketDetail[];
  subtotal: number;
  serviceFee: number;
  total: number;
  translations: {
    eventDetails: string;
    date: string;
    location: string;
    ticketSummary: string;
    quantity: string;
    price: string;
    subtotal: string;
    serviceFee: string;
    total: string;
  };
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  eventTitle,
  eventDate,
  eventImage,
  localName,
  ticketDetails,
  subtotal,
  serviceFee,
  total,
  translations: t
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.eventDetails}</h2>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <img 
              src={eventImage || "https://source.unsplash.com/random/600x400/?concert"} 
              alt={eventTitle} 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-4">
            <h3 className="text-lg font-medium">{eventTitle}</h3>
            <p className="text-gray-600 mb-2">{formatDate(eventDate || new Date().toISOString())}</p>
            <p className="text-gray-600">{localName}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.ticketSummary}</h2>
        <div className="divide-y">
          {ticketDetails.map((ticket, index) => (
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
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>{t.serviceFee}</span>
            <span>{serviceFee.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-3">
            <span>{t.total}</span>
            <span className="text-tango-primary">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
