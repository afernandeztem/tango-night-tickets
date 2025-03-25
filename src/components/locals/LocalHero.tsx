
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users } from 'lucide-react';
import { Local } from '../../types';

interface LocalHeroProps {
  local: Local;
}

const LocalHero: React.FC<LocalHeroProps> = ({ local }) => {
  return (
    <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={local.image} 
          alt={local.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{local.name}</h1>
            <div className="flex items-center text-white/90 mb-4">
              <MapPin size={16} className="mr-2" />
              <span>{local.city}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star size={16} className="text-yellow-400 mr-1.5" />
                <span className="font-medium">{local.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users size={16} className="mr-1.5" />
                <span>{local.capacity} capacity</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalHero;
