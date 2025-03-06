import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Bell, BellOff, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getUserTickets } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TicketCard from '../components/TicketCard';

const ProfilePage: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  
  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ['userTickets'],
    queryFn: getUserTickets
  });
  
  const translations = {
    en: {
      profile: 'Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      preferences: 'Preferences',
      notifications: 'Notifications',
      enableNotifications: 'Enable notifications',
      disableNotifications: 'Disable notifications',
      upcomingEvents: 'Your Tickets',
      noTickets: 'You have no tickets yet',
      logout: 'Logout',
      eventsRecommendation: 'Check out upcoming events in your city!',
      browseEvents: 'Browse Events'
    },
    es: {
      profile: 'Perfil',
      personalInfo: 'Información Personal',
      name: 'Nombre',
      email: 'Correo',
      preferences: 'Preferencias',
      notifications: 'Notificaciones',
      enableNotifications: 'Activar notificaciones',
      disableNotifications: 'Desactivar notificaciones',
      upcomingEvents: 'Tus Entradas',
      noTickets: 'Aún no tienes entradas',
      logout: 'Cerrar sesión',
      eventsRecommendation: '¡Consulta los próximos eventos en tu ciudad!',
      browseEvents: 'Explorar Eventos'
    }
  };
  
  const t = translations[state.language];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
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
          <h1 className="text-3xl font-bold mb-8 text-center">{t.profile}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-1">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-tango-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                      {authState.user?.name ? authState.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="text-xl font-semibold">{authState.user?.name || 'User'}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-700 mb-4">{t.personalInfo}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User size={20} className="mr-3 text-tango-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">{t.name}</div>
                        <div>{authState.user?.name || 'User'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail size={20} className="mr-3 text-tango-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">{t.email}</div>
                        <div>{authState.user?.email || 'user@example.com'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-700 mb-4">{t.preferences}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {notifications ? (
                          <Bell size={20} className="mr-3 text-tango-primary" />
                        ) : (
                          <BellOff size={20} className="mr-3 text-gray-400" />
                        )}
                        <span>{t.notifications}</span>
                      </div>
                      <button
                        onClick={toggleNotifications}
                        className="text-sm text-tango-primary hover:underline"
                      >
                        {notifications ? t.disableNotifications : t.enableNotifications}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="mt-8 flex items-center text-red-500 hover:text-red-700"
                  >
                    <LogOut size={18} className="mr-2" />
                    {t.logout}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Ticket size={20} className="mr-2 text-tango-primary" />
                {t.upcomingEvents}
              </h2>
              
              {loadingTickets ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} event={ticket} />
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <div className="text-gray-500 mb-4">{t.noTickets}</div>
                  <p className="text-tango-primary mb-4">{t.eventsRecommendation}</p>
                  <button
                    onClick={() => navigate('/events')}
                    className="px-4 py-2 bg-tango-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {t.browseEvents}
                  </button>
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
