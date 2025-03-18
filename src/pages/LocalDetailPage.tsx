import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId, getLocalReviews } from '../services/api';
import { Local, Event, Drink } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import ScrollableSection from '../components/ScrollableSection';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Clock, Navigation, Tags, Users, Info, Wine, Ticket, Gift, MessageSquare } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const LocalDetailPage: React.FC = () => {
  const { localId } = useParams<{ localId: string }>();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  const [local, setLocal] = useState<Local | null>(null);
  const [eventsData, setEventsData] = useState<{ content: Event[] } | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<{ local: boolean; events: boolean; drinks: boolean; reviews: boolean }>({
    local: true,
    events: true,
    drinks: true,
    reviews: true,
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
      drinkOffers: 'Drinks & Offers',
      information: 'Information',
      venue: 'Venue',
      scheduleFor: 'Schedule for',
      closed: 'Closed',
      capacityInfo: 'Capacity',
      drinks: 'Drinks',
      offers: 'Offers',
      noDrinksAvailable: 'No drinks information available for this venue.',
      noOffersAvailable: 'No special offers available at this venue.',
      from: 'From',
      getDirections: 'Get Directions',
      upcomingEventsAt: 'Upcoming Events at',
      category: 'Category',
      reviews: 'Reviews',
      noReviews: 'No reviews available for this venue.',
      reviewsTitle: 'Customer Reviews',
      reviewsSubtitle: 'See what others are saying',
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
      drinkOffers: 'Bebidas y Ofertas',
      information: 'Información',
      venue: 'Local',
      scheduleFor: 'Horario para',
      closed: 'Cerrado',
      capacityInfo: 'Capacidad',
      drinks: 'Bebidas',
      offers: 'Ofertas',
      noDrinksAvailable: 'No hay información de bebidas disponible para este local.',
      noOffersAvailable: 'No hay ofertas especiales disponibles en este local.',
      from: 'Desde',
      getDirections: 'Obtener Direcciones',
      upcomingEventsAt: 'Próximos Eventos en',
      category: 'Categoría',
      reviews: 'Reseñas',
      noReviews: 'No hay reseñas disponibles para este local.',
      reviewsTitle: 'Reseñas de Clientes',
      reviewsSubtitle: 'Mira lo que otros están diciendo',
    }
  };
  
  const t = translations[state.language];
  
  useEffect(() => {
    const fetchLocal = async () => {
      if (!localId) return;
      
      setLoading(prev => ({ ...prev, local: true }));
      
      try {
        const localData = await getLocalById(localId);
        setLocal(localData);
      } catch (error) {
        console.error('Error fetching local:', error);
      } finally {
        setLoading(prev => ({ ...prev, local: false }));
      }
    };
    
    fetchLocal();
  }, [localId]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!localId) return;
      
      setLoading(prev => ({ ...prev, events: true }));
      
      try {
        const events = await getEventsByLocalId(localId);
        setEventsData(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };
    
    fetchEvents();
  }, [localId]);

  useEffect(() => {
    const fetchDrinks = async () => {
      if (!localId) return;
      
      setLoading(prev => ({ ...prev, drinks: true }));
      
      try {
        const drinksData = await getDrinksByLocalId(localId);
        setDrinks(drinksData);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      } finally {
        setLoading(prev => ({ ...prev, drinks: false }));
      }
    };
    
    fetchDrinks();
  }, [localId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!localId) return;
      
      setLoading(prev => ({ ...prev, reviews: true }));
      
      try {
        const reviewsData = await getLocalReviews(localId);
        setReviews(reviewsData.content);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(prev => ({ ...prev, reviews: false }));
      }
    };
    
    fetchReviews();
  }, [localId]);

  const upcomingEvents = eventsData?.content || [];
  const hasEvents = upcomingEvents.length > 0;
  const hasDrinks = drinks.length > 0;
  const hasReviews = reviews.length > 0;
  
  const viewAllLink = localId ? `/events?localId=${localId}` : '/events';

  const drinksByCategory = drinks.reduce((acc, drink) => {
    const category = drink.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(drink);
    return acc;
  }, {} as Record<string, Drink[]>);

  const getDaysOfWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const orderedDays = [...days.slice(today === 0 ? 6 : today - 1), ...days.slice(0, today === 0 ? 6 : today - 1)];
    return orderedDays;
  };

  const orderedDays = getDaysOfWeek();

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
                      <TabsTrigger value="drinkoffers" className="flex items-center gap-1.5">
                        <Wine size={16} />
                        {t.drinkOffers}
                      </TabsTrigger>
                      <TabsTrigger value="directions" className="flex items-center gap-1.5">
                        <Navigation size={16} />
                        {t.directions}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <Card className="overflow-hidden border border-gray-200 shadow-sm">
                          <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">{t.information}</h2>
                            <p className="text-gray-700 mb-6">
                              {local.description || t.noDescription}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {Array.isArray(local.tags) && local.tags.map((tag, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary"
                                  className="bg-tango-secondary/30 text-tango-primary hover:bg-tango-secondary/40"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="mt-8">
                              <div className="flex items-center mb-4">
                                <MessageSquare size={20} className="mr-2 text-tango-primary" />
                                <h3 className="text-xl font-semibold">{t.reviewsTitle}</h3>
                              </div>
                              
                              {loading.reviews ? (
                                <div className="space-y-4">
                                  {[1, 2, 3].map((_, index) => (
                                    <div key={index} className="animate-pulse">
                                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                                    </div>
                                  ))}
                                </div>
                              ) : hasReviews ? (
                                <div className="space-y-4">
                                  {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium">{review.userName}</div>
                                        <div className="flex items-center">
                                          <Star size={16} className="text-yellow-400 mr-1" />
                                          <span>{review.score}</span>
                                        </div>
                                      </div>
                                      <p className="text-gray-600">{review.comment}</p>
                                      {review.createdAt && (
                                        <div className="text-xs text-gray-400 mt-1">
                                          {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                                  <p className="text-gray-500">{t.noReviews}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card className="overflow-hidden border border-gray-200 shadow-sm">
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
                  
                  <TabsContent value="schedule" className="mt-0">
                    <Card className="overflow-hidden border border-gray-200 shadow-sm">
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
                  
                  <TabsContent value="events" className="mt-0">
                    <Card className="overflow-hidden border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-semibold">{t.upcomingEventsAt} {local.name}</h2>
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
                          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <Calendar size={40} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 font-medium">{t.noEvents}</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later for upcoming events at this venue.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="drinkoffers" className="mt-0">
                    <Card className="overflow-hidden border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Wine className="text-tango-primary" size={24} />
                          <h2 className="text-2xl font-semibold">{t.drinks}</h2>
                        </div>
                        
                        {loading.drinks ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((_, index) => (
                              <div key={index} className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : hasDrinks ? (
                          <div className="space-y-6">
                            {Object.entries(drinksByCategory).map(([category, categoryDrinks]) => (
                              <div key={category}>
                                <h3 className="text-lg font-medium mb-3 text-tango-primary">
                                  {category}
                                </h3>
                                <div className="space-y-3">
                                  {categoryDrinks.map((drink) => (
                                    <div key={drink.id} className="flex justify-between py-2 border-b border-gray-100">
                                      <div>
                                        <h4 className="font-medium">{drink.name}</h4>
                                        {drink.description && (
                                          <p className="text-sm text-gray-600">{drink.description}</p>
                                        )}
                                      </div>
                                      <div className="text-tango-primary font-semibold">
                                        {drink.price.toFixed(2)} €
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <Wine size={40} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">{t.noDrinksAvailable}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="directions" className="mt-0">
                    <Card className="overflow-hidden border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6">{t.directions}</h2>
                        <div className="bg-gradient-to-r from-tango-secondary/20 to-white rounded-lg p-6 border border-tango-secondary/20">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-start">
                              <div className="bg-tango-primary rounded-full p-3 mr-4 shadow-md">
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
                              className="bg-tango-primary text-white px-6 py-3 rounded-md hover:bg-tango-primary/90 transition-colors flex items-center justify-center shadow-md self-start md:self-center"
                            >
                              <Navigation size={18} className="mr-2" />
                              {t.getDirections}
                            </a>
                          </div>
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
