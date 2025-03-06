
import React from 'react';
import { Ticket } from '../types';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface TicketCardProps {
  ticket: Ticket;
  onRemove?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onRemove }) => {
  const { state } = useApp();
  
  const translations = {
    en: {
      tickets: 'tickets',
      ticket: 'ticket',
      price: 'Price',
      total: 'Total',
      remove: 'Remove'
    },
    es: {
      tickets: 'entradas',
      ticket: 'entrada',
      price: 'Precio',
      total: 'Total',
      remove: 'Eliminar'
    }
  };
  
  const t = translations[state.language];
  
  return (
    <div className="tango-card">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 bg-tango-secondary rounded-lg mr-4">
            <TicketIcon size={24} className="text-tango-primary" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{ticket.eventTitle}</h3>
            <p className="text-gray-600 text-sm">{ticket.localName}</p>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>{formatDate(ticket.date, state.language)}</span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <span className="px-3 py-1 bg-tango-secondary text-tango-primary rounded-full text-sm font-medium">
              {ticket.quantity} {ticket.quantity > 1 ? t.tickets : t.ticket}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{t.price}:</span>
          <span className="font-medium">{ticket.price.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between items-center font-semibold">
          <span>{t.total}:</span>
          <span className="text-tango-primary">{(ticket.price * ticket.quantity).toFixed(2)} €</span>
        </div>
        
        {onRemove && (
          <button 
            onClick={onRemove}
            className="mt-3 w-full py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t.remove}
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
