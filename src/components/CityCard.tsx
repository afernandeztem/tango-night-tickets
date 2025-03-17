
import React from 'react';
import { City } from '../types';
import { motion } from 'framer-motion';

interface CityCardProps {
  city: City;
  onClick: (city: City) => void;
  imagePath?: string;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick, imagePath }) => {
  // Create a modified city object with normalized name for display but preserve original for API
  const handleClick = () => {
    const normalizedCity = {
      ...city,
      displayName: city.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      originalName: city.name // Keep the original name with accents for API calls
    };
    onClick(normalizedCity);
  };

  return (
    <motion.div 
      className="city-card cursor-pointer overflow-hidden rounded-xl shadow-lg"
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imagePath || city.image || 'https://source.unsplash.com/random/800x600/?city'} 
          alt={city.name}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <motion.div 
          className="absolute bottom-0 left-0 p-5 w-full"
          initial={{ y: 10, opacity: 0.8 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{city.name}</h3>
          {city.country && (
            <div className="flex items-center">
              <span className="inline-block w-10 h-0.5 bg-tango-primary mr-2"></span>
              <p className="text-white text-sm font-medium">{city.country}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CityCard;
