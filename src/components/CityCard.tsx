
import React from 'react';
import { City } from '../types';
import { motion } from 'framer-motion';

interface CityCardProps {
  city: City;
  onClick: (city: City) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => {
  const handleClick = () => {
    const normalizedCity = {
      ...city,
      displayName: city.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      originalName: city.name
    };
    onClick(normalizedCity);
  };

  return (
    <motion.div 
      className="city-card relative cursor-pointer overflow-hidden rounded-2xl shadow-lg"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }}
      onClick={handleClick}
    >
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img 
          src={city.image} 
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
            {city.country && (
              <div className="flex items-center">
                <span className="inline-block w-8 h-0.5 bg-tango-primary mr-2"></span>
                <p className="text-white/90 text-sm">{city.country}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CityCard;
