
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../types';
import { formatDate } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isFavorite }) => {
  const { state } = useApp();
  
  return (
    <Link 
      to={`/events/${event.id}`}
      className="block group"
    >
      <div className="tango-card group-hover:shadow-md transition-shadow">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={event.image || 'https://source.unsplash.com/random/800x600/?concert'} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-sm font-medium">
            {event.price.toFixed(2)} €
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-tango-primary transition-colors">
            {event.title}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{event.localName}, {event.city}</span>
          </div>
          
          {event.tags && event.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-tango-secondary text-tango-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
