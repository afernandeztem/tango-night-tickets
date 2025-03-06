
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isFavorite = false }) => {
  const navigate = useNavigate();
  const { state: authState, toggleFavorite } = useAuth();
  const { state } = useApp();
  
  const translations = {
    en: {
      capacity: 'Capacity',
      age: 'Age',
      viewDetails: 'View Details',
      price: 'Price',
    },
    es: {
      capacity: 'Capacidad',
      age: 'Edad',
      viewDetails: 'Ver Detalles',
      price: 'Precio',
    }
  };
  
  const t = translations[state.language];
  
  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authState.isAuthenticated) {
      toggleFavorite('event', event.id);
    } else {
      navigate('/auth?mode=login');
    }
  };
  
  return (
    <div 
      className="tango-card cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={event.image || 'https://source.unsplash.com/random/800x600/?event'} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-2 right-2">
          <button 
            onClick={handleFavoriteClick}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
          >
            <Heart size={18} fill={isFavorite ? "#C5198F" : "none"} color={isFavorite ? "#C5198F" : "white"} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{event.title}</h3>
          <p className="text-white/80 text-sm">{event.localName}</p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar size={16} className="mr-1" />
          <span>{formatDate(event.date, state.language)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span>{event.city}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t.price}</span>
            <span className="font-semibold text-tango-primary">{event.price.toFixed(2)} €</span>
          </div>
          <button className="tango-button text-sm">
            {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
