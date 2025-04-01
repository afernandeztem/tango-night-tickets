
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Local } from '../types';
import { MapPin, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LocalCardProps {
  local: Local;
  isFavorite?: boolean;
}

const LocalCard: React.FC<LocalCardProps> = ({ local, isFavorite = false }) => {
  const navigate = useNavigate();
  const { state: authState, toggleFavorite } = useAuth();
  const { state } = useApp();
  
  const translations = {
    en: {
      capacity: 'Capacity',
      rating: 'Rating',
      viewDetails: 'View Details'
    },
    es: {
      capacity: 'Capacidad',
      rating: 'Valoración',
      viewDetails: 'Ver Detalles'
    }
  };
  
  const t = translations[state.language];
  
  const createSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/\s+/g, '-')            // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '');     // Remove all non-alphanumeric characters except hyphens
  };
  
  const handleClick = () => {
    // Use the local ID directly for navigation instead of the slug
    navigate(`/locals/${local.id}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authState.isAuthenticated) {
      toggleFavorite('local', local.id);
    } else {
      navigate('/auth?mode=login');
    }
  };

  // Make sure tags is an array before using array methods on it
  const tagsArray = Array.isArray(local.tags) ? local.tags : (local.tags ? [local.tags] : []);
  
  return (
    <div 
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={local.image || 'https://source.unsplash.com/random/800x600/?club'} 
            alt={local.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          <div className="absolute top-2 right-2">
            <button 
              onClick={handleFavoriteClick}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
            >
              <Heart size={18} fill={isFavorite ? "#C5198F" : "none"} color={isFavorite ? "#C5198F" : "white"} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3">
            <h3 className="text-lg font-semibold text-white line-clamp-1">{local.name}</h3>
            <div className="flex items-center text-white/80 text-sm">
              <MapPin size={14} className="mr-1" />
              <span>{local.city}</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tagsArray.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2.5 py-1 bg-tango-secondary text-tango-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{local.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{local.capacity}</span>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-tango-primary text-white rounded-md font-medium hover:bg-tango-primary/90 transition-colors text-sm">
            {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalCard;
