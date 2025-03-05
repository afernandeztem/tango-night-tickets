
import React from 'react';
import { Local } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';

interface LocalCardProps {
  local: Local;
}

const LocalCard: React.FC<LocalCardProps> = ({ local }) => {
  return (
    <Link to={`/locals/${local.id}`} className="block">
      <div className="tango-card group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {local.image ? (
            <img 
              src={local.image} 
              alt={local.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-tango-secondary animate-pulse"></div>
          )}
          <div className="absolute top-2 right-2 bg-white/90 text-tango-primary text-sm font-medium px-2 py-1 rounded-full flex items-center">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
            {local.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-medium mb-2">{local.name}</h3>
          <div className="space-y-2 mb-3 flex-grow">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-tango-primary" />
              <span>{local.address}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-tango-primary" />
              <span>Capacity: {local.capacity}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {local.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-tango-secondary text-tango-primary rounded-full"
              >
                {tag}
              </span>
            ))}
            {local.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{local.tags.length - 3} more
              </span>
            )}
          </div>
          <button className="tango-button w-full mt-4">View Details</button>
        </div>
      </div>
    </Link>
  );
};

export default LocalCard;
