
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
import { MapPin, Calendar, Star, Clock, Navigation, Tags, Users, Info } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

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
      viewAll: 'View All',
      overview: 'Overview',
      schedule: 'Schedule',
      events: 'Events',
      directions: 'Directions',
      information: 'Information',
      venue: 'Venue',
      scheduleFor: 'Schedule for',
      closed: 'Closed',
      capacityInfo: 'Capacity',
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
      viewAll: 'Ver Todos',
      overview: 'Resumen',
      schedule: 'Horario',
      events: 'Eventos',
      directions: 'Dirección',
      information: 'Información',
      venue: 'Local',
      scheduleFor: 'Horario para',
      closed: 'Cerrado',
      capacityInfo: 'Capacidad',
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

  const upcomingEvents = eventsData?.content || [];
  const hasEvents = upcomingEvents.length > 0;
  
  // Create a view all link for the events
  const viewAllLink = localId ? `/events?localId=${localId}` : '/events';

  // Get days of the week in order starting from today
  const getDaysOfWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const orderedDays = [...days.slice(today === 0 ? 6 : today - 1), ...days.slice(0, today === 0 ? 6 : today - 1)];
    return orderedDays;
  };

  const orderedDays = getDaysOfWeek();
  
  // Loading skeleton
  if (loading.local) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-72 bg-gray-200 rounded-xl"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Local not found
  if (!loading.local && !local) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
            <button 
              onClick={() => navigate('/locals')}
              className="tango-button"
            >
              Browse Venues
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {local && (
          <>
            {/* Hero section */}
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
                        <span>{local.capacity} {t.capacity}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
            
            {/* Content section with tabs */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="mb-6">
                    <TabsList className="w-full justify-start overflow-x-auto bg-white border">
                      <TabsTrigger value="overview" className="flex items-center gap-1.5">
                        <Info size={16} />
                        {t.overview}
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {t.schedule}
                      </TabsTrigger>
                      <TabsTrigger value="events" className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {t.events}
                      </TabsTrigger>
                      <TabsTrigger value="directions" className="flex items-center gap-1.5">
                        <Navigation size={16} />
                        {t.directions}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <Card>
                          <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">{t.information}</h2>
                            <p className="text-gray-700 mb-6">
                              {local.description || t.noDescription}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {Array.isArray(local.tags) && local.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="text-sm px-3 py-1.5 bg-tango-secondary text-tango-primary rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4">{t.venue} {t.information}</h3>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">{t.address}</h4>
                                <p className="flex items-start">
                                  <MapPin size={18} className="mr-2 mt-0.5 text-tango-primary" />
                                  <span>{local.address}, {local.city}</span>
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">{t.capacityInfo}</h4>
                                <p className="flex items-start">
                                  <Users size={18} className="mr-2 mt-0.5 text-tango-primary" />
                                  <span>{local.capacity} {t.capacity}</span>
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Schedule Tab */}
                  <TabsContent value="schedule" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6">{t.scheduleFor} {local.name}</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                          {orderedDays.map((day, index) => {
                            const scheduleForDay = local.schedule?.find(s => s.day.toLowerCase() === day.toLowerCase());
                            
                            return (
                              <div 
                                key={index} 
                                className={`p-4 rounded-lg border ${index === 0 ? 'bg-tango-secondary/20 border-tango-primary/20' : 'bg-white'}`}
                              >
                                <h3 className={`text-center font-semibold mb-2 ${index === 0 ? 'text-tango-primary' : ''}`}>
                                  {day}
                                </h3>
                                {scheduleForDay ? (
                                  <div className="text-center">
                                    <div className="text-sm">
                                      <Clock size={14} className="inline mr-1 text-tango-primary" />
                                      {scheduleForDay.openTime} - {scheduleForDay.closeTime}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-500 text-sm">
                                    {t.closed}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Events Tab */}
                  <TabsContent value="events" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-semibold">{t.upcomingEvents}</h2>
                          {hasEvents && (
                            <a 
                              href={viewAllLink} 
                              className="text-tango-primary font-medium hover:underline flex items-center"
                            >
                              {t.viewAll}
                            </a>
                          )}
                        </div>
                        
                        {loading.events ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((_, index) => (
                              <div key={index} className="animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                <div className="p-4 space-y-3 bg-white rounded-b-lg">
                                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : hasEvents ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.slice(0, 6).map(event => (
                              <motion.div 
                                key={event.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <EventCard 
                                  event={event} 
                                  isFavorite={
                                    authState.isAuthenticated &&
                                    authState.user?.favorites?.events.includes(event.id)
                                  }
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Calendar size={40} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">{t.noEvents}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Directions Tab */}
                  <TabsContent value="directions" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6">{t.directions}</h2>
                        <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-between">
                          <div className="flex items-start">
                            <div className="bg-tango-primary rounded-full p-3 mr-4">
                              <MapPin size={24} className="text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{local.name}</h3>
                              <p className="text-gray-600">{local.address}, {local.city}</p>
                            </div>
                          </div>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-tango-primary text-white px-4 py-2 rounded-md hover:bg-tango-primary/90 transition-colors"
                          >
                            <Navigation size={18} className="inline mr-2" />
                            Get Directions
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default LocalDetailPage;
