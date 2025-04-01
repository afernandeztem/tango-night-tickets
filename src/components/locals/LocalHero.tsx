
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Heart } from 'lucide-react';
import { Local } from '../../types';

interface LocalHeroProps {
  local: Local;
}

const LocalHero: React.FC<LocalHeroProps> = ({ local }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 min-h-[65vh]">
      {/* Full-width blurred background */}
      <div className="absolute inset-0 w-full h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={local.image} 
          alt={local.name} 
          className="w-full h-full object-cover blur-md scale-110 opacity-60" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://source.unsplash.com/random/1200x800/?nightclub';
          }}
        />
      </div>

      {/* Content Container with the clear image */}
      <div className="container relative mx-auto px-4 pt-20 pb-32 z-20">
        <div className="flex flex-col items-center">
          {/* Clear Foreground Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-sm border border-white/10"
          >
            <img 
              src={local.image} 
              alt={local.name} 
              className="w-full h-[45vh] object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://source.unsplash.com/random/1200x800/?nightclub';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            {/* Local Information Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {/* Category Label */}
              <div className="mb-3">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="uppercase text-xs tracking-wider text-white font-semibold px-4 py-1.5 bg-gradient-to-r from-tango-primary to-tango-secondary rounded-full shadow-lg"
                >
                  Club
                </motion.span>
              </div>
              
              {/* Local Name */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md"
              >
                {local.name}
              </motion.h1>
              
              {/* Meta Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
              >
                <div className="flex items-center text-white/90">
                  <MapPin size={16} className="mr-2 text-tango-primary" />
                  <span>{local.city}</span>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="flex items-center text-white/90">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < Math.floor(local.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} mr-0.5`} 
                        />
                      ))}
                    </div>
                    <span className="ml-1.5 font-medium">{local.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center text-white/90">
                    <Users size={16} className="mr-1.5 text-tango-primary" />
                    <span>{local.capacity} capacity</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved white section that overlaps with the hero */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-white z-10"
        style={{ 
          borderTopLeftRadius: '32px', 
          borderTopRightRadius: '32px',
        }}
      />

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 p-3.5 rounded-full bg-gradient-to-r from-tango-primary/80 to-tango-secondary/80 backdrop-blur-sm hover:from-tango-primary hover:to-tango-secondary transition-all z-30 shadow-lg"
      >
        <Heart size={22} className="text-white" />
      </motion.button>
    </section>
  );
};

export default LocalHero;
