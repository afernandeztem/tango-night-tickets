
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
      <div className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image || 'https://source.unsplash.com/random/800x600/?concert'} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          
          {/* Only display price badge if price exists AND is greater than 0 */}
          {event.price && event.price > 0 ? (
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm">
              {event.price.toFixed(2)} €
            </div>
          ) : null}
          
          {/* Tags overlay at the bottom of the image */}
          {event.tags && event.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {event.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-1 bg-tango-primary/90 text-white text-xs font-medium rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
          <h3 className="font-semibold text-lg mb-3 group-hover:text-tango-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center text-sm">
              <Calendar size={15} className="mr-2 text-tango-primary" />
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin size={15} className="mr-2 text-tango-primary" />
              <span className="line-clamp-1">{event.localName}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
