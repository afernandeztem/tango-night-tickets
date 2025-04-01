
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Local } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LocalHeroProps {
  local: Local;
}

const LocalHero: React.FC<LocalHeroProps> = ({ local }) => {
  const { state: authState, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isFavorite = authState.isAuthenticated && 
    authState.user?.favorites?.locals?.includes(local.id);
    
  const handleFavoriteClick = () => {
    if (authState.isAuthenticated) {
      toggleFavorite('local', local.id);
    } else {
      // Redirect to login page
      toast({
        title: "Authentication required",
        description: "Please login to add to favorites",
      });
      navigate('/auth?mode=login');
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Full-width blurred background */}
      <div className="absolute inset-0 w-full h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={local.image} 
          alt={local.name} 
          className="w-full h-full object-cover blur-md scale-110 opacity-80" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://source.unsplash.com/random/1200x800/?nightclub';
          }}
        />
      </div>

      {/* Content Container with the clear image */}
      <div className="container relative mx-auto px-4 pt-16 pb-8 z-20">
        <div className="flex flex-col items-center">
          {/* Clear Foreground Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-2 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-white"
          >
            <img 
              src={local.image} 
              alt={local.name} 
              className="w-full h-[40vh] object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://source.unsplash.com/random/1200x800/?nightclub';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* Local Information Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Category Label */}
              <div className="mb-3">
                <span className="uppercase text-xs tracking-wider text-white font-semibold px-3 py-1 bg-tango-primary rounded-full">
                  Club
                </span>
              </div>
              
              {/* Local Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{local.name}</h1>
              
              {/* Meta Information */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex items-center text-white/90">
                  <MapPin size={16} className="mr-2 text-tango-primary" />
                  <span>{local.city}</span>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="flex items-center text-white/90">
                    <Star size={16} className="text-yellow-400 mr-1.5" />
                    <span className="font-medium">{local.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center text-white/90">
                    <Users size={16} className="mr-1.5 text-tango-primary" />
                    <span>{local.capacity} capacity</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved white section that overlaps with the hero */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 bg-white z-10"
        style={{ 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px',
        }}
      />

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFavoriteClick}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all z-30"
      >
        <Heart 
          size={20} 
          className={isFavorite ? "text-tango-primary fill-tango-primary" : "text-white"} 
        />
      </motion.button>
    </section>
  );
};

export default LocalHero;
