
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart, Calendar, Store, Filter } from 'lucide-react';
import { Local, Event } from '../types';
import { useApp } from '../context/AppContext';
import { getFavoriteEvents, getFavoriteLocals } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalCard from '../components/LocalCard';
import EventCard from '../components/EventCard';

const FavoritesPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'locals' | 'events'>('locals');
  
  const { data: favoriteLocals, isLoading: loadingLocals } = useQuery({
    queryKey: ['favoriteLocals'],
    queryFn: getFavoriteLocals
  });
  
  const { data: favoriteEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ['favoriteEvents'],
    queryFn: getFavoriteEvents
  });
  
  const translations = {
    en: {
      title: 'My Favorites',
      empty: 'You don\'t have any favorites yet',
      browseLocals: 'Browse Locals',
      browseEvents: 'Browse Events',
      locals: 'Favorite Venues',
      events: 'Favorite Events',
      loading: 'Loading your favorites...'
    },
    es: {
      title: 'Mis Favoritos',
      empty: 'Aún no tienes favoritos',
      browseLocals: 'Explorar Locales',
      browseEvents: 'Explorar Eventos',
      locals: 'Locales Favoritos',
      events: 'Eventos Favoritos',
      loading: 'Cargando tus favoritos...'
    }
  };
  
  const t = translations[state.language];
  
  const noFavorites = 
    (!loadingLocals && (!favoriteLocals || favoriteLocals.length === 0)) && 
    (!loadingEvents && (!favoriteEvents || favoriteEvents.length === 0));
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">{t.title}</h1>
          
          {noFavorites ? (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-6">{t.empty}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/locals')}
                  className="px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {t.browseLocals}
                </button>
                <button 
                  onClick={() => navigate('/events')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  {t.browseEvents}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex border-b mb-8">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'locals' ? 'text-tango-primary border-b-2 border-tango-primary' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('locals')}
                >
                  <div className="flex items-center">
                    <Store size={18} className="mr-2" />
                    {t.locals}
                  </div>
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'events' ? 'text-tango-primary border-b-2 border-tango-primary' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('events')}
                >
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    {t.events}
                  </div>
                </button>
              </div>
              
              {activeTab === 'locals' && (
                <>
                  {loadingLocals ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
                      <p>{t.loading}</p>
                    </div>
                  ) : favoriteLocals && favoriteLocals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteLocals.map((local: Local) => (
                        <LocalCard key={local.id} local={local} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Store size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>{t.empty}</p>
                      <button 
                        onClick={() => navigate('/locals')}
                        className="mt-4 px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        {t.browseLocals}
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'events' && (
                <>
                  {loadingEvents ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
                      <p>{t.loading}</p>
                    </div>
                  ) : favoriteEvents && favoriteEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteEvents.map((event: Event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>{t.empty}</p>
                      <button 
                        onClick={() => navigate('/events')}
                        className="mt-4 px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        {t.browseEvents}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
