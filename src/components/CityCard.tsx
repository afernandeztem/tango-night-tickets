
import React from 'react';
import { City } from '../types';

interface CityCardProps {
  city: City;
  onClick: (city: City) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => {
  return (
    <div 
      className="tango-card cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => onClick(city)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={city.image || 'https://source.unsplash.com/random/800x600/?city'} 
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-semibold text-white">{city.name}</h3>
          {city.country && (
            <p className="text-white/80 text-sm">{city.country}</p>
          )}
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {city.active ? 'Available now' : 'Coming soon'}
          </span>
          <button className="tango-button text-sm py-1 px-3">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
