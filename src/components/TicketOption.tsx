
import React from 'react';
import { Plus, Minus, Clock } from 'lucide-react';

interface Ticket {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  soldOut?: boolean;
  timeLeft?: string;
}

interface TicketOptionProps {
  ticket: Ticket;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  translations: Record<string, string>;
}

const TicketOption: React.FC<TicketOptionProps> = ({ 
  ticket, 
  quantity, 
  onQuantityChange,
  translations: t
}) => {
  return (
    <div className={`border rounded-lg overflow-hidden ${ticket.soldOut ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{ticket.name}</h3>
          <div className="text-right">
            <span className="text-lg font-bold">{ticket.price.toFixed(2)} €</span>
          </div>
        </div>
        
        {ticket.soldOut && (
          <div className="text-red-500 text-sm font-medium mb-2">
            {t.soldOut}
          </div>
        )}
        
        {ticket.timeLeft && (
          <div className="flex items-center text-orange-500 text-sm font-medium mb-2">
            <Clock size={14} className="mr-1" />
            {t.salesEndIn} {ticket.timeLeft}
          </div>
        )}
        
        <p className="text-gray-600 text-sm mb-4">
          {ticket.description}
        </p>
        
        <div className="flex justify-between items-center">
          {ticket.available ? (
            <div className="flex items-center">
              <button 
                onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                className="p-1 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                disabled={quantity === 0}
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button 
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-1 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <div></div>
          )}
          
          {ticket.available && quantity > 0 && (
            <div className="text-tango-primary font-medium">
              {(ticket.price * quantity).toFixed(2)} €
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketOption;
