
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocalById, getEventsByLocalId } from '../services/api';
import { Local, Event } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import ScrollableSection from '../components/ScrollableSection';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star } from 'lucide-react';

const LocalDetailPage: React.FC = () => {
  const { localId } = useParams<{ localId: string }>();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  const [local, setLocal] = useState<Local | null>(null);
  const [eventsData, setEventsData] = useState<{ content: Event[] } | null>(null);
  const [loading, setLoading] = useState<{ local: boolean; events: boolean }>({
    local: true,
    events: true,
  });
  
  const translations = {
    en: {
      address: 'Address',
      upcomingEvents: 'Upcoming Events',
      noEvents: 'No upcoming events at this venue.',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      goBack: 'Go Back',
      ageRestriction: 'Age Restriction',
      capacity: 'Capacity',
      price: 'Price',
      buyTickets: 'Buy Tickets',
      noDescription: 'No description available.',
      viewAll: 'View All'
    },
    es: {
      address: 'Dirección',
      upcomingEvents: 'Próximos Eventos',
      noEvents: 'No hay próximos eventos en este local.',
      addToFavorites: 'Agregar a Favoritos',
      removeFromFavorites: 'Eliminar de Favoritos',
      goBack: 'Volver',
      ageRestriction: 'Restricción de Edad',
      capacity: 'Capacidad',
      price: 'Precio',
      buyTickets: 'Comprar Entradas',
      noDescription: 'No hay descripción disponible.',
      viewAll: 'Ver Todos'
    }
  };
  
  const t = translations[state.language];
  
  useEffect(() => {
    const fetchLocal = async () => {
      if (!localId) return;
      
      setLoading({ ...loading, local: true });
      
      try {
        const localData = await getLocalById(localId);
        setLocal(localData);
      } catch (error) {
        console.error('Error fetching local:', error);
      } finally {
        setLoading({ ...loading, local: false });
      }
    };
    
    fetchLocal();
  }, [localId]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!localId) return;
      
      setLoading({ ...loading, events: true });
      
      try {
        const events = await getEventsByLocalId(localId);
        setEventsData(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading({ ...loading, events: false });
      }
    };
    
    fetchEvents();
  }, [localId]);
  
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

  const upcomingEvents = eventsData?.content || [];
  const hasEvents = upcomingEvents.length > 0;
  
  // Create a view all link for the events
  const viewAllLink = localId ? `/events?localId=${localId}` : '/events';
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading.local ? (
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-tango-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : local ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8"
              >
                <div className="md:w-1/2">
                  <img 
                    src={local.image} 
                    alt={local.name} 
                    className="w-full h-64 object-cover rounded-lg shadow-md" 
                  />
                </div>
                <div className="md:w-1/2">
                  <h1 className="text-3xl font-bold mb-4">{local.name}</h1>
                  <p className="text-gray-700 mb-4">{local.description || t.noDescription}</p>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-2" />
                    {t.address}: {local.address}, {local.city}
                  </div>
                  
                  {local.schedule && local.schedule.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Schedule</h3>
                      <ul>
                        {local.schedule.map((item, index) => (
                          <li key={index} className="text-gray-600">
                            {item.day}: {item.openTime} - {item.closeTime}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate(-1)}
                    className="tango-button"
                  >
                    {t.goBack}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-10">
                <p>Local not found.</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollableSection
              title={t.upcomingEvents}
              viewAllText={t.viewAll}
              viewAllLink={viewAllLink}
              isLoading={loading.events}
              hasMore={false}
            >
              {hasEvents ? (
                upcomingEvents.map(event => (
                  <motion.div 
                    key={event.id} 
                    variants={itemVariants}
                    className="flex-none w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
                  >
                    <EventCard 
                      event={event} 
                      isFavorite={
                        authState.isAuthenticated &&
                        authState.user?.favorites?.events.includes(event.id)
                      }
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p>{t.noEvents}</p>
                </div>
              )}
            </ScrollableSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LocalDetailPage;
