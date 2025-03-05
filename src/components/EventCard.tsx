
import React from 'react';
import { Event } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="tango-card group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-tango-secondary animate-pulse"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-2 right-2 bg-tango-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            ${event.price}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
            {event.ageRestriction}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-medium mb-2 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 mb-3 flex-grow">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-tango-primary" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-tango-primary" />
              <span>{event.localName || 'Unknown venue'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-tango-primary" />
              <span>Capacity: {event.capacity}</span>
            </div>
          </div>
          <button className="tango-button w-full mt-auto">View Details</button>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
