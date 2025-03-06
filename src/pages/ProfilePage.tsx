
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { User, Settings, Ticket, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getUserTickets } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TicketCard from '../components/TicketCard';

const ProfilePage: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: appState, setLanguage } = useApp();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [authState.isAuthenticated, navigate]);
  
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['userTickets'],
    queryFn: () => getUserTickets(),
    enabled: authState.isAuthenticated
  });
  
  const translations = {
    en: {
      profile: 'Profile',
      welcome: 'Welcome back',
      myTickets: 'My Tickets',
      noTickets: 'You have no tickets yet',
      settings: 'Settings',
      language: 'Language',
      english: 'English',
      spanish: 'Spanish',
      logout: 'Logout',
      ticketsSection: 'Your Tickets',
      viewTicket: 'View Ticket',
      loading: 'Loading...'
    },
    es: {
      profile: 'Perfil',
      welcome: 'Bienvenido/a',
      myTickets: 'Mis Entradas',
      noTickets: 'Aún no tienes entradas',
      settings: 'Configuración',
      language: 'Idioma',
      english: 'Inglés',
      spanish: 'Español',
      logout: 'Cerrar Sesión',
      ticketsSection: 'Tus Entradas',
      viewTicket: 'Ver Entrada',
      loading: 'Cargando...'
    }
  };
  
  const t = translations[appState.language];
  
  const handleLanguageChange = (language: 'en' | 'es') => {
    setLanguage(language);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!authState.isAuthenticated) {
    return null; // Will redirect due to useEffect
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">{t.profile}</h1>
          
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-gray-50 border rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-tango-secondary rounded-full flex items-center justify-center text-tango-primary">
                  <User size={32} />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">{t.welcome}</p>
                  <h2 className="text-xl font-semibold">{authState.user?.name}</h2>
                  <p className="text-gray-600">{authState.user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Settings Section */}
            <div className="bg-white border rounded-xl mb-8">
              <h2 className="text-xl font-semibold p-6 border-b">{t.settings}</h2>
              
              <div className="divide-y">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings size={20} className="text-gray-500 mr-3" />
                      <span>{t.language}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`px-3 py-1 rounded ${appState.language === 'en' ? 'bg-tango-secondary text-tango-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {t.english}
                      </button>
                      <button
                        onClick={() => handleLanguageChange('es')}
                        className={`px-3 py-1 rounded ${appState.language === 'es' ? 'bg-tango-secondary text-tango-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {t.spanish}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-500 hover:text-red-600"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tickets Section */}
            <div className="bg-white border rounded-xl">
              <h2 className="text-xl font-semibold p-6 border-b">{t.ticketsSection}</h2>
              
              {ticketsLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tango-primary mb-4"></div>
                  <p>{t.loading}</p>
                </div>
              ) : tickets && Array.isArray(tickets) && tickets.length > 0 ? (
                <div className="divide-y">
                  {tickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{ticket.eventTitle}</h3>
                          <p className="text-sm text-gray-600">{ticket.date}</p>
                          <p className="text-sm text-gray-600">x{ticket.quantity}</p>
                        </div>
                        <button className="flex items-center text-tango-primary hover:underline">
                          {t.viewTicket}
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Ticket size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>{t.noTickets}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
