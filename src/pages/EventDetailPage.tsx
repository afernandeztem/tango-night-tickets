import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, Clock, Users, Info, Ticket, Heart } from 'lucide-react';
import { Event } from '../types';
import { getEventById } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { state } = useApp();
  const { state: authState, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(1);
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId
  });
  
  const translations = {
    en: {
      backToEvents: 'Back to Events',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      capacity: 'Capacity',
      ageRestriction: 'Age Restriction',
      description: 'Description',
      tickets: 'Tickets',
      ticketsAvailable: 'Tickets Available',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      buyTickets: 'Buy Tickets',
      loading: 'Loading event details...',
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites'
    },
    es: {
      backToEvents: 'Volver a Eventos',
      date: 'Fecha',
      time: 'Hora',
      location: 'Ubicación',
      capacity: 'Capacidad',
      ageRestriction: 'Restricción de edad',
      description: 'Descripción',
      tickets: 'Entradas',
      ticketsAvailable: 'Entradas Disponibles',
      quantity: 'Cantidad',
      price: 'Precio',
      total: 'Total',
      buyTickets: 'Comprar Entradas',
      loading: 'Cargando detalles del evento...',
      addToFavorites: 'Añadir a favoritos',
      removeFromFavorites: 'Eliminar de favoritos'
    }
  };
  
  const t = translations[state.language];
  
  const handleBuyTickets = () => {
    navigate('/checkout', { 
      state: { 
        eventId: event?.id,
        eventTitle: event?.title,
        quantity: ticketCount,
        price: event?.price,
        total: (event?.price || 0) * ticketCount
      } 
    });
  };
  
  const isFavorite = authState.user?.favorites?.events.includes(eventId || '') || false;
  
  const handleToggleFavorite = () => {
    if (authState.isAuthenticated) {
      toggleFavorite('event', eventId || '');
    } else {
      navigate('/auth?mode=login');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
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
          onClick={() => navigate('/events')}
          className="text-tango-primary hover:underline mb-4 flex items-center"
        >
          ← {t.backToEvents}
        </button>
        
        {event && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <img 
                src={event.image || 'https://source.unsplash.com/random/1200x800/?concert'} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleToggleFavorite}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                  aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                >
                  <Heart 
                    size={24} 
                    fill={isFavorite ? "#C5198F" : "none"} 
                    color={isFavorite ? "#C5198F" : "white"} 
                  />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
                <div className="flex items-center text-white text-sm md:text-base">
                  <span>{event.localName}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(event.date, state.language)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 text-tango-primary" />
                      <h3 className="font-semibold">{t.date}</h3>
                    </div>
                    <p>{formatDate(event.date, state.language)}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center mb-2">
                      <Clock size={18} className="mr-2 text-tango-primary" />
                      <h3 className="font-semibold">{t.time}</h3>
                    </div>
                    <p>{event.time || '20:00'}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center mb-2">
                      <MapPin size={18} className="mr-2 text-tango-primary" />
                      <h3 className="font-semibold">{t.location}</h3>
                    </div>
                    <p>{event.localName}, {event.city}</p>
                  </div>
                  
                  {event.capacity && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center mb-2">
                        <Users size={18} className="mr-2 text-tango-primary" />
                        <h3 className="font-semibold">{t.capacity}</h3>
                      </div>
                      <p>{event.capacity}</p>
                    </div>
                  )}
                  
                  {event.ageRestriction && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center mb-2">
                        <Info size={18} className="mr-2 text-tango-primary" />
                        <h3 className="font-semibold">{t.ageRestriction}</h3>
                      </div>
                      <p>{event.ageRestriction}+</p>
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">{t.description}</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="border rounded-lg p-6 bg-gray-50 sticky top-4">
                  <div className="flex items-center mb-4">
                    <Ticket size={20} className="mr-2 text-tango-primary" />
                    <h2 className="text-xl font-semibold">{t.tickets}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.quantity}
                    </label>
                    <div className="flex border rounded-md">
                      <button 
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r"
                        onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center py-2 focus:outline-none"
                      />
                      <button 
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-l"
                        onClick={() => setTicketCount(prev => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t.price}</span>
                      <span>{event.price.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t.total}</span>
                      <span className="text-tango-primary">{(event.price * ticketCount).toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleBuyTickets}
                    className="w-full py-3 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {t.buyTickets}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventDetailPage;
