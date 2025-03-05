
import React from 'react';
import { CartItem } from '../types';
import { formatDate } from '../utils/formatters';
import { Trash } from 'lucide-react';

interface TicketCardProps {
  item: CartItem;
  onRemove?: () => void;
  isCheckout?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ item, onRemove, isCheckout = false }) => {
  return (
    <div className="tango-card p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{item.eventTitle}</h3>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove ticket"
            >
              <Trash className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-1">{item.localName}</p>
        <p className="text-gray-600 text-sm mt-2">{formatDate(item.date)}</p>
        
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">Quantity:</span>
            <span className="ml-2 text-lg font-medium">{item.quantity}</span>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="ml-2 text-lg font-medium">${item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {isCheckout && (
        <div className="border-t pt-3 md:border-t-0 md:border-l md:pl-4 md:pt-0 flex flex-col items-end justify-center">
          <div className="text-right">
            <p className="text-gray-600 text-sm">Subtotal</p>
            <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
