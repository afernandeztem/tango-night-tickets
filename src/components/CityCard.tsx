
import React from 'react';
import { City } from '../types';

interface CityCardProps {
  city: City;
  onClick: (city: City) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => {
  return (
    <div 
      className="tango-card group cursor-pointer overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
      onClick={() => onClick(city)}
    >
      <div className="relative h-48 overflow-hidden">
        {city.image ? (
          <img 
            src={city.image} 
            alt={city.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-tango-secondary animate-pulse"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="relative -mt-16 px-4 pb-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-1">{city.name}</h3>
          <p className="text-gray-600 text-sm">{city.country}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-tango-secondary text-tango-primary rounded-full">
              {city.active ? 'Active' : 'Coming Soon'}
            </span>
            <button 
              className="text-tango-primary text-sm font-medium hover:underline"
            >
              Discover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
