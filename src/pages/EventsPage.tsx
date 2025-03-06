
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Search, Filter } from 'lucide-react';
import { Event } from '../types';
import { getEvents } from '../services/api';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EventsPage: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', state.selectedCity, searchTerm, dateFilter],
    queryFn: () => getEvents({ 
      city: state.selectedCity,
      search: searchTerm || undefined,
      startDate: dateFilter || undefined
    })
  });
  
  const translations = {
    en: {
      title: 'Events',
      subtitle: 'Discover upcoming events in',
      search: 'Search events...',
      date: 'Filter by date',
      clearFilters: 'Clear filters',
      noEvents: 'No events found with the current filters',
      loading: 'Loading events...'
    },
    es: {
      title: 'Eventos',
      subtitle: 'Descubre próximos eventos en',
      search: 'Buscar eventos...',
      date: 'Filtrar por fecha',
      clearFilters: 'Limpiar filtros',
      noEvents: 'No se encontraron eventos con los filtros actuales',
      loading: 'Cargando eventos...'
    }
  };
  
  const t = translations[state.language];
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
  };
  
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
          <p className="text-xl text-gray-600 mb-8 text-center">
            {t.subtitle} {state.selectedCity ? state.selectedCity : ''}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-tango-primary focus:border-tango-primary"
              />
            </div>
            
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-tango-primary focus:border-tango-primary"
              />
            </div>
            
            {(searchTerm || dateFilter) && (
              <button 
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
              <p>{t.loading}</p>
            </div>
          ) : events && events.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.content.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Filter size={48} className="mx-auto mb-4 text-gray-300" />
              <p>{t.noEvents}</p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
