
import React from 'react';
import { motion } from "framer-motion";
import { City } from '../types';
import CityCard from "./CityCard";

interface CityGridProps {
  cities: City[];
  onCitySelect: (city: City) => void;
  isLoading: boolean;
}

const CityGrid: React.FC<CityGridProps> = ({ cities, onCitySelect, isLoading }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mb-10">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-56 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {cities.map((city, index) => {
            console.log(`City: ${city.name}, Image: ${city.image}`);
            
            return (
              <motion.div
                key={city.id}
                variants={item}
                custom={index}
                className="transform-gpu"
              >
                <CityCard 
                  city={city} 
                  onClick={onCitySelect}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CityGrid;
