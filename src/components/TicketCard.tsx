import React from 'react';

interface TicketCardProps {
  event: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    date: string;
  };
}

const TicketCard: React.FC<TicketCardProps> = ({ event }) => {
  return (
    <div className="tango-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-gray-600">Quantity: {event.quantity}</p>
        <p className="text-gray-600">Price: {event.price.toFixed(2)} €</p>
      </div>
    </div>
  );
};

export default TicketCard;
