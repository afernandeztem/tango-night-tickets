import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, Users, Clock, Tag, Star } from 'lucide-react';
import { Local, Event, Drink } from '../types';
import { getLocalById, getEventsByLocalId, getDrinksByLocalId } from '../services/api';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LocalDetailPage: React.FC = () => {
  const { localId } = useParams<{ localId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  
  const { data: local, isLoading: loadingLocal } = useQuery({
    queryKey: ['local', localId],
    queryFn: () => getLocalById(localId!),
    enabled: !!localId
  });
  
  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ['events', localId],
    queryFn: () => getEventsByLocalId(localId!),
    enabled: !!localId
  });
  
  const { data: drinks, isLoading: loadingDrinks } = useQuery({
    queryKey: ['drinks', localId],
    queryFn: () => getDrinksByLocalId(localId!),
    enabled: !!localId
  });
  
  const translations = {
    en: {
      backToLocals: 'Back to Locals',
      address: 'Address',
      schedule: 'Schedule',
      capacity: 'Capacity',
      tags: 'Tags',
      events: 'Events at this local',
      noEvents: 'No upcoming events at this local',
      drinks: 'Drinks & Offers',
      noDrinks: 'No drinks information available'
    },
    es: {
      backToLocals: 'Volver a Locales',
      address: 'Dirección',
      schedule: 'Horario',
      capacity: 'Capacidad',
      tags: 'Etiquetas',
      events: 'Eventos en este local',
      noEvents: 'No hay próximos eventos en este local',
      drinks: 'Bebidas y Ofertas',
      noDrinks: 'No hay información de bebidas disponible'
    }
  };
  
  const t = translations[state.language];
  
  const renderSchedule = (schedule: any) => {
    if (typeof schedule === 'string') {
      return schedule;
    } else if (Array.isArray(schedule)) {
      return (
        <ul className="space-y-1">
          {schedule.map((item, index) => (
            <li key={index}>
              {item.day}: {item.openTime} - {item.closeTime}
            </li>
          ))}
        </ul>
      );
    }
    return "Schedule information not available";
  };
  
  if (loadingLocal) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/locals')}
          className="text-tango-primary hover:underline mb-4 flex items-center"
        >
          ← {t.backToLocals}
        </button>
        
        {local && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-60 md:h-80 rounded-lg overflow-hidden mb-6">
              <img 
                src={local.image || 'https://source.unsplash.com/random/1200x800/?nightclub'} 
                alt={local.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{local.name}</h1>
                <div className="flex items-center text-white">
                  <MapPin size={16} className="mr-1" />
                  <span>{local.city}</span>
                  {local.rating && (
                    <div className="ml-4 flex items-center">
                      <Star size={16} className="mr-1 text-yellow-400" />
                      <span>{local.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{t.address}</h2>
                  <p className="text-gray-700">{local.address}</p>
                </div>
                
                {local.description && (
                  <div className="mb-6">
                    <p className="text-gray-700">{local.description}</p>
                  </div>
                )}
                
                {local.schedule && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{t.schedule}</h2>
                    <div className="flex items-start">
                      <Clock size={18} className="mr-2 text-tango-primary mt-1" />
                      <div className="text-gray-700">
                        {renderSchedule(local.schedule)}
                      </div>
                    </div>
                  </div>
                )}
                
                {local.capacity && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{t.capacity}</h2>
                    <div className="flex items-center">
                      <Users size={18} className="mr-2 text-tango-primary" />
                      <p className="text-gray-700">{local.capacity}</p>
                    </div>
                  </div>
                )}
                
                {local.tags && local.tags.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{t.tags}</h2>
                    <div className="flex flex-wrap gap-2">
                      {local.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-tango-secondary text-tango-primary rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                {drinks && drinks.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4">{t.drinks}</h2>
                    <ul className="space-y-3">
                      {drinks.map((drink, index) => (
                        <li key={index} className="border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="flex justify-between">
                            <span className="font-medium">{drink.name}</span>
                            <span className="text-tango-primary font-semibold">{drink.price.toFixed(2)} €</span>
                          </div>
                          {drink.description && (
                            <p className="text-sm text-gray-600">{drink.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {(!drinks || drinks.length === 0) && !loadingDrinks && (
                  <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                    {t.noDrinks}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">{t.events}</h2>
              
              {loadingEvents && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse border rounded-lg overflow-hidden">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loadingEvents && events && events.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
              
              {!loadingEvents && (!events || events.length === 0) && (
                <div className="text-center text-gray-500 py-10">
                  {t.noEvents}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LocalDetailPage;
