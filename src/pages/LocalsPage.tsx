
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Store, MapPin } from 'lucide-react';
import { Local } from '../types';
import { getLocals } from '../services/api';
import { useApp } from '../context/AppContext';
import LocalCard from '../components/LocalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LocalsPage: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: locals, isLoading } = useQuery({
    queryKey: ['locals', state.selectedCity, searchTerm],
    queryFn: () => getLocals({ 
      city: state.selectedCity, 
      search: searchTerm || undefined 
    })
  });
  
  const translations = {
    en: {
      title: 'Locals',
      subtitle: 'Discover venues in',
      search: 'Search locals...',
      noLocals: 'No locals found with the current filters',
      loading: 'Loading locals...'
    },
    es: {
      title: 'Locales',
      subtitle: 'Descubre lugares en',
      search: 'Buscar locales...',
      noLocals: 'No se encontraron locales con los filtros actuales',
      loading: 'Cargando locales...'
    }
  };
  
  const t = translations[state.language];
  
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
            {t.subtitle} {state.selectedCity}
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-tango-primary focus:border-tango-primary"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
              <p>{t.loading}</p>
            </div>
          ) : locals && locals.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locals.content.map((local: Local) => (
                <LocalCard key={local.id} local={local} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Store size={48} className="mx-auto mb-4 text-gray-300" />
              <p>{t.noLocals}</p>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default LocalsPage;
