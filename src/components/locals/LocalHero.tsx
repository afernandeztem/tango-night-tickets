
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Heart } from 'lucide-react';
import { Local } from '../../types';

interface LocalHeroProps {
  local: Local;
}

const LocalHero: React.FC<LocalHeroProps> = ({ local }) => {
  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      {/* Hero Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={local.image} 
          alt={local.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://source.unsplash.com/random/1200x800/?nightclub';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 pb-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            {/* Category Label */}
            <div className="mb-3">
              <span className="uppercase text-xs tracking-wider text-tango-primary font-semibold px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                Club
              </span>
            </div>
            
            {/* Local Name */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{local.name}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              <div className="flex items-center text-white/80">
                <MapPin size={16} className="mr-2 text-tango-primary" />
                <span>{local.city}</span>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1.5" />
                  <span className="font-medium">{local.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center">
                  <Users size={16} className="mr-1.5 text-tango-primary" />
                  <span>{local.capacity} capacity</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          <Heart size={20} className="text-white" />
        </motion.button>
      </div>
    </section>
  );
};

export default LocalHero;
