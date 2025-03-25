import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId, getLocalReviews, getLocalOffers } from '../services/api';
import { Local, Event, Drink } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Star, Clock, Navigation, Tags, 
  Users, Info, Wine, Ticket, MessageSquare, Sparkle, 
  Martini, PartyPopper, ChevronRight
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const LocalDetailPage: React.FC = () => {
  const { localSlug } = useParams<{ localSlug: string }>();
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  
  const [local, setLocal] = useState<Local | null>(null);
  const [eventsData, setEventsData] = useState<{ content: Event[] } | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<{ local: boolean; events: boolean; drinks: boolean; offers: boolean; reviews: boolean }>({
    local: true,
    events: true,
    drinks: true,
    offers: true,
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
      scheduleFor: 'Schedule',
      closed: 'Closed',
      capacityInfo: 'Capacity',
      drinks: 'Drinks',
      offers: 'Offers',
      noDrinksAvailable: 'No drinks information available for this venue.',
      noOffersAvailable: 'No special offers available at this venue.',
      from: 'From',
      getDirections: 'Get Directions',
      upcomingEventsAt: 'Upcoming Events',
      category: 'Category',
      reviews: 'Reviews',
      noReviews: 'No reviews available for this venue.',
      reviewsTitle: 'Customer Reviews',
      reviewsSubtitle: 'See what others are saying',
      today: 'Today',
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
      scheduleFor: 'Horario',
      closed: 'Cerrado',
      capacityInfo: 'Capacidad',
      drinks: 'Bebidas',
      offers: 'Ofertas',
      noDrinksAvailable: 'No hay información de bebidas disponible para este local.',
      noOffersAvailable: 'No hay ofertas especiales disponibles en este local.',
      from: 'Desde',
      getDirections: 'Obtener Direcciones',
      upcomingEventsAt: 'Próximos Eventos',
      category: 'Categoría',
      reviews: 'Reseñas',
      noReviews: 'No hay reseñas disponibles para este local.',
      reviewsTitle: 'Reseñas de Clientes',
      reviewsSubtitle: 'Mira lo que otros están diciendo',
      today: 'Hoy',
    }
  };
  
  const t = translations[state.language];
  
  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await fetch('https://api.grupotangoapp.com/public/locals?city=Madrid');
        const data = await response.json();
        const locals = data.content || [];
        
        if (localSlug && locals.length > 0) {
          const foundLocal = locals.find((local: any) => {
            const slug = local.name.toLowerCase().normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return slug === localSlug;
          });
          
          if (foundLocal) {
            console.log('Found local with matching slug:', foundLocal);
            setLocal({
              id: foundLocal.localId,
              name: foundLocal.name,
              description: foundLocal.description || '',
              address: foundLocal.address || '',
              city: foundLocal.city || '',
              capacity: foundLocal.capacity || 0,
              rating: foundLocal.rating || 4.5,
              tags: foundLocal.categories || [],
              image: foundLocal.filename || 'https://source.unsplash.com/random/800x600/?club',
              schedule: foundLocal.schedule || []
            });
            
            fetchAdditionalLocalData(foundLocal.localId);
          } else {
            console.error('Local not found with slug:', localSlug);
            setLoading(prev => ({ ...prev, local: false }));
          }
        } else {
          console.error('No locals found or no localSlug provided');
          setLoading(prev => ({ ...prev, local: false }));
        }
      } catch (error) {
        console.error('Error fetching locals:', error);
        setLoading(prev => ({ ...prev, local: false }));
      }
    };
    
    const fetchAdditionalLocalData = (localId: string) => {
      fetchEvents(localId);
      fetchDrinks(localId);
      fetchOffers(localId);
      fetchReviews(localId);
      setLoading(prev => ({ ...prev, local: false }));
    };
    
    fetchLocals();
  }, [localSlug]);
  
  const fetchEvents = async (localId: string) => {
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

  const fetchDrinks = async (localId: string) => {
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

  const fetchOffers = async (localId: string) => {
    setLoading(prev => ({ ...prev, offers: true }));
    
    try {
      const offersData = await getLocalOffers(localId);
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(prev => ({ ...prev, offers: false }));
    }
  };

  const fetchReviews = async (localId: string) => {
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

  const upcomingEvents = eventsData?.content || [];
  const hasEvents = upcomingEvents.length > 0;
  const hasDrinks = drinks.length > 0;
  const hasOffers = offers.length > 0;
  const hasReviews = reviews.length > 0;
  
  const viewAllLink = local?.id ? `/events?localId=${local.id}` : '/events';

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
            {/* Hero Section */}
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
            
            {/* Content Section */}
            <section className="py-8">
              <div className="container mx-auto px-4 max-w-5xl">
                {/* Overview */}
                <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-tango-primary/10 p-2 rounded-full">
                        <Info className="text-tango-primary h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-semibold">{t.overview}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
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
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">{t.venue} {t.information}</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">{t.address}</h4>
                            <p className="flex items-start">
                              <MapPin size={18} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                              <span>{local.address}, {local.city}</span>
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">{t.capacityInfo}</h4>
                            <p className="flex items-start">
                              <Users size={18} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                              <span>{local.capacity} {t.capacity}</span>
                            </p>
                          </div>
                          
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-tango-primary text-white px-4 py-2 rounded-md hover:bg-tango-primary/90 transition-colors flex items-center justify-center shadow-sm mt-2"
                          >
                            <Navigation size={16} className="mr-2" />
                            {t.getDirections}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Schedule */}
                <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-tango-primary/10 p-2 rounded-full">
                        <Clock className="text-tango-primary h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-semibold">{t.scheduleFor}</h2>
                    </div>
                    
                    <div className="overflow-x-auto pb-2">
                      <div className="grid grid-cols-7 gap-3 min-w-[640px]">
                        {orderedDays.map((day, index) => {
                          const scheduleForDay = local.schedule?.find(s => s.day.toLowerCase() === day.toLowerCase());
                          
                          return (
                            <div 
                              key={index} 
                              className={`p-4 rounded-lg border ${index === 0 ? 'bg-tango-secondary/20 border-tango-primary/20' : 'bg-white'}`}
                            >
                              <h3 className={`text-center font-semibold mb-2 ${index === 0 ? 'text-tango-primary' : ''}`}>
                                {day}
                                {index === 0 && <span className="block text-xs mt-1">({t.today})</span>}
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
                    </div>
                  </CardContent>
                </Card>
                
                {/* Events */}
                <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-tango-primary/10 p-2 rounded-full">
                          <Calendar className="text-tango-primary h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold">{t.upcomingEventsAt}</h2>
                      </div>
                      {hasEvents && (
                        <a 
                          href={viewAllLink} 
                          className="text-tango-primary font-medium hover:underline flex items-center"
                        >
                          {t.viewAll}
                          <ChevronRight size={16} className="ml-1" />
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
                        {upcomingEvents.slice(0, 3).map(event => (
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
                
                {/* Drinks & Offers */}
                <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    {/* Offers Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-tango-primary/10 p-2 rounded-full">
                          <PartyPopper className="text-tango-primary h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold">{t.offers}</h2>
                      </div>
                      
                      {loading.offers ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((_, index) => (
                            <div key={index} className="animate-pulse bg-gray-50 rounded-lg p-5">
                              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : hasOffers ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {offers.map((offer) => (
                            <motion.div 
                              key={offer.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-300 border border-gray-100 group"
                            >
                              <div className="p-0.5 bg-tango-primary"></div>
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800 group-hover:text-tango-primary transition-colors">
                                    {offer.name}
                                  </h4>
                                  <Badge variant="outline" className="bg-tango-primary/10 text-tango-primary border-tango-primary/20 font-medium">
                                    {offer.price?.toFixed(2) || "0.00"} €
                                  </Badge>
                                </div>
                                {offer.description && (
                                  <p className="text-gray-600 text-sm">{offer.description}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <PartyPopper size={20} className="text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">{t.noOffersAvailable}</p>
                        </div>
                      )}
                    </div>

                    {/* Drinks Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-tango-primary/10 p-2 rounded-full">
                          <Wine className="text-tango-primary h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold">{t.drinks}</h2>
                      </div>
                      
                      {loading.drinks ? (
                        <div className="space-y-6">
                          {[1, 2].map((category, idx) => (
                            <div key={idx} className="animate-pulse bg-gray-50 rounded-lg p-5">
                              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map((drink, index) => (
                                  <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : hasDrinks ? (
                        <div className="space-y-6">
                          {Object.entries(drinksByCategory).map(([category, categoryDrinks], categoryIndex) => (
                            <div 
                              key={category}
                              className="bg-gray-50 p-5 rounded-lg border border-gray-100"
                            >
                              <h3 className="text-lg font-medium mb-4 text-gray-700">
                                <Badge className="bg-tango-primary text-white border-0">
                                  {category}
                                </Badge>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {categoryDrinks.map((drink, drinkIndex) => (
                                  <motion.div 
                                    key={drink.id || drinkIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2, delay: drinkIndex * 0.05 }}
                                    className="flex justify-between p-3 rounded-md bg-white border border-gray-100 hover:border-tango-primary/20 transition-colors shadow-sm"
                                  >
                                    <div>
                                      <h4 className="font-medium text-gray-800">{drink.name}</h4>
                                      {drink.description && (
                                        <p className="text-sm text-gray-500 mt-1">{drink.description}</p>
                                      )}
                                    </div>
                                    <div className="bg-tango-primary/10 text-tango-primary font-medium px-3 py-1 rounded-full text-sm self-start">
                                      {drink.price?.toFixed(2) || "0.00"} €
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Wine size={20} className="text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">{t.noDrinksAvailable}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-tango-primary/10 p-2 rounded-full">
                        <MessageSquare className="text-tango-primary h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-semibold">{t.reviewsTitle}</h2>
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
                  </CardContent>
                </Card>
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
