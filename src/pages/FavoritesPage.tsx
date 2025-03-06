
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart, Store, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { fetchFavoriteEvents, fetchFavoriteLocals } from '../services/api';
import EventCard from '../components/EventCard';
import LocalCard from '../components/LocalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FavoritesPage: React.FC = () => {
  const { state: authState } = useAuth();
  const { state } = useApp();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  const { data: favoriteEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ['favoriteEvents'],
    queryFn: fetchFavoriteEvents
  });
  
  const { data: favoriteLocals, isLoading: loadingLocals } = useQuery({
    queryKey: ['favoriteLocals'],
    queryFn: fetchFavoriteLocals
  });
  
  const translations = {
    en: {
      favorites: 'Favorites',
      noFavorites: 'You have no favorites yet',
      addSome: 'Explore events and locals to add some!',
      events: 'Events',
      locals: 'Locals',
      explore: 'Explore',
      loading: 'Loading favorites...'
    },
    es: {
      favorites: 'Favoritos',
      noFavorites: 'Aún no tienes favoritos',
      addSome: '¡Explora eventos y locales para añadir algunos!',
      events: 'Eventos',
      locals: 'Locales',
      explore: 'Explorar',
      loading: 'Cargando favoritos...'
    }
  };
  
  const t = translations[state.language];
  
  const hasAnyFavorites = 
    (favoriteEvents && favoriteEvents.length > 0) || 
    (favoriteLocals && favoriteLocals.length > 0);
  
  const isLoading = loadingEvents || loadingLocals;
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-8">
            <Heart className="text-tango-primary mr-3" size={28} />
            <h1 className="text-3xl font-bold">{t.favorites}</h1>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
              <p>{t.loading}</p>
            </div>
          ) : !hasAnyFavorites ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <Heart className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-xl font-semibold mb-2">{t.noFavorites}</h2>
              <p className="text-gray-500 mb-6">{t.addSome}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/events')}
                  className="px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
                >
                  <Calendar size={18} className="mr-2" />
                  {t.events}
                </button>
                <button
                  onClick={() => navigate('/locals')}
                  className="px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
                >
                  <Store size={18} className="mr-2" />
                  {t.locals}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {favoriteEvents && favoriteEvents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Calendar size={24} className="mr-3 text-tango-primary" />
                    {t.events}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteEvents.map(event => (
                      <EventCard key={event.id} event={event} isFavorite={true} />
                    ))}
                  </div>
                </div>
              )}
              
              {favoriteLocals && favoriteLocals.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Store size={24} className="mr-3 text-tango-primary" />
                    {t.locals}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteLocals.map(local => (
                      <LocalCard key={local.id} local={local} isFavorite={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
