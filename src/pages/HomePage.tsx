import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, Local } from '../types';
import { getEvents, getLocals, getFavoriteEvents, getFavoriteLocals } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import LocalCard from '../components/LocalCard';
import CitySelector from '../components/CitySelector';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  const [highlightedEvents, setHighlightedEvents] = useState<Event[]>([]);
  const [highlightedLocals, setHighlightedLocals] = useState<Local[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [favoriteLocals, setFavoriteLocals] = useState<Local[]>([]);
  const [loading, setLoading] = useState<{
    events: boolean;
    locals: boolean;
    favorites: boolean;
  }>({
    events: true,
    locals: true,
    favorites: authState.isAuthenticated,
  });
  
  const translations = {
    en: {
      welcome: 'Welcome to',
      discoverCity: 'Discover the nightlife in',
      highlightedEvents: 'Highlighted Events',
      highlightedLocals: 'Popular Venues',
      favoriteEvents: 'Your Favorite Events',
      favoriteLocals: 'Your Favorite Venues',
      viewAll: 'View All',
      noFavorites: 'You have no favorites yet. Explore events and venues to add some!',
      exploreEvents: 'Explore Events',
      exploreLocals: 'Explore Venues',
      cityNotSelected: 'Please select a city to continue'
    },
    es: {
      welcome: 'Bienvenido a',
      discoverCity: 'Descubre la vida nocturna en',
      highlightedEvents: 'Eventos Destacados',
      highlightedLocals: 'Locales Populares',
      favoriteEvents: 'Tus Eventos Favoritos',
      favoriteLocals: 'Tus Locales Favoritos',
      viewAll: 'Ver Todo',
      noFavorites: '¡Aún no tienes favoritos. Explora eventos y locales para añadir algunos!',
      exploreEvents: 'Explorar Eventos',
      exploreLocals: 'Explorar Locales',
      cityNotSelected: 'Por favor selecciona una ciudad para continuar'
    }
  };
  
  const t = translations[state.language];
  
  useEffect(() => {
    if (!state.selectedCity) {
      navigate('/');
    }
  }, [state.selectedCity, navigate]);
  
  useEffect(() => {
    const fetchHighlightedContent = async () => {
      if (!state.selectedCity) return;
      
      setLoading({ ...loading, events: true, locals: true });
      
      try {
        const eventsResponse = await getEvents({
          city: state.selectedCity.name,
          relevant: true,
        });
        setHighlightedEvents(eventsResponse.content.slice(0, 3));
        
        const localsResponse = await getLocals({
          city: state.selectedCity.name,
          relevant: true,
        });
        setHighlightedLocals(localsResponse.content.slice(0, 3));
      } catch (error) {
        console.error('Error fetching highlighted content:', error);
      } finally {
        setLoading({ ...loading, events: false, locals: false });
      }
    };
    
    fetchHighlightedContent();
  }, [state.selectedCity]);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!authState.isAuthenticated) return;
      
      setLoading({ ...loading, favorites: true });
      
      try {
        const favoriteEvents = await getFavoriteEvents();
        setFavoriteEvents(favoriteEvents);
        
        const favoriteLocals = await getFavoriteLocals();
        setFavoriteLocals(favoriteLocals);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading({ ...loading, favorites: false });
      }
    };
    
    if (authState.isAuthenticated) {
      fetchFavorites();
    }
  }, [authState.isAuthenticated]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  if (!state.selectedCity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t.cityNotSelected}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-tango-primary/10 to-tango-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 font-darker">
                {t.welcome} <span className="text-tango-primary">TangoApp</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
                {t.discoverCity} 
                <span className="font-semibold flex items-center">
                  <CitySelector className="font-semibold underline decoration-dotted underline-offset-4 ml-1" />
                </span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button 
                  className="tango-button flex items-center"
                  onClick={() => navigate('/events')}
                >
                  <Calendar size={18} className="mr-2" />
                  {t.exploreEvents}
                </button>
                <button 
                  className="bg-white text-tango-primary border border-tango-primary rounded-md px-4 py-2 font-medium transition-all duration-300 hover:bg-tango-secondary flex items-center"
                  onClick={() => navigate('/locals')}
                >
                  <MapPin size={18} className="mr-2" />
                  {t.exploreLocals}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold font-darker">{t.highlightedEvents}</h2>
              <button 
                className="text-tango-primary font-medium flex items-center text-sm hover:underline"
                onClick={() => navigate('/events')}
              >
                {t.viewAll}
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            {loading.events ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {highlightedEvents.map(event => (
                  <motion.div key={event.id} variants={itemVariants}>
                    <EventCard 
                      event={event}
                      isFavorite={
                        authState.isAuthenticated &&
                        authState.user?.favorites?.events.includes(event.id)
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold font-darker">{t.highlightedLocals}</h2>
              <button 
                className="text-tango-primary font-medium flex items-center text-sm hover:underline"
                onClick={() => navigate('/locals')}
              >
                {t.viewAll}
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            {loading.locals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {highlightedLocals.map(local => (
                  <motion.div key={local.id} variants={itemVariants}>
                    <LocalCard 
                      local={local} 
                      isFavorite={
                        authState.isAuthenticated &&
                        authState.user?.favorites?.locals.includes(local.id)
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
        
        {authState.isAuthenticated && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              {loading.favorites ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-tango-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (favoriteEvents.length > 0 || favoriteLocals.length > 0) ? (
                <>
                  {favoriteEvents.length > 0 && (
                    <div className="mb-10">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">{t.favoriteEvents}</h2>
                        <button 
                          className="text-tango-primary font-medium flex items-center text-sm hover:underline"
                          onClick={() => navigate('/favorites')}
                        >
                          {t.viewAll}
                          <ArrowRight size={16} className="ml-1" />
                        </button>
                      </div>
                      
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {favoriteEvents.slice(0, 3).map(event => (
                          <motion.div key={event.id} variants={itemVariants}>
                            <EventCard event={event} isFavorite={true} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                  
                  {favoriteLocals.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">{t.favoriteLocals}</h2>
                        <button 
                          className="text-tango-primary font-medium flex items-center text-sm hover:underline"
                          onClick={() => navigate('/favorites')}
                        >
                          {t.viewAll}
                          <ArrowRight size={16} className="ml-1" />
                        </button>
                      </div>
                      
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {favoriteLocals.slice(0, 3).map(local => (
                          <motion.div key={local.id} variants={itemVariants}>
                            <LocalCard local={local} isFavorite={true} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-tango-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={24} className="text-tango-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {t.noFavorites}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      className="tango-button"
                      onClick={() => navigate('/events')}
                    >
                      {t.exploreEvents}
                    </button>
                    <button 
                      className="bg-white text-tango-primary border border-tango-primary rounded-md px-4 py-2 font-medium transition-all duration-300 hover:bg-tango-secondary"
                      onClick={() => navigate('/locals')}
                    >
                      {t.exploreLocals}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
