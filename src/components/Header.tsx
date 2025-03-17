import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Heart, User, Menu, X, LogIn, LogOut, Globe } from 'lucide-react';
import TangoLogo from './TangoLogo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { state: authState, logout } = useAuth();
  const { state: appState, setLanguage } = useApp();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };
  
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];
  
  const translations = {
    en: {
      home: 'Home',
      locals: 'Locals',
      events: 'Events',
      favorites: 'Favorites',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },
    es: {
      home: 'Inicio',
      locals: 'Locales',
      events: 'Eventos',
      favorites: 'Favoritos',
      profile: 'Perfil',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión'
    }
  };
  
  const t = translations[appState.language];
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <TangoLogo variant="icon" />
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="nav-link">{t.home}</Link>
            <Link to="/locals" className="nav-link">{t.locals}</Link>
            <Link to="/events" className="nav-link">{t.events}</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe size={20} />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 py-1">
                  {languageOptions.map(lang => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2 text-sm ${appState.language === lang.code ? 'bg-tango-secondary text-tango-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setLanguage(lang.code as 'en' | 'es');
                        setIsLanguageOpen(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {authState.isAuthenticated && (
              <Link 
                to="/favorites" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart size={20} />
              </Link>
            )}
            
            {authState.isAuthenticated ? (
              <div className="hidden md:flex items-center">
                <Link 
                  to="/profile" 
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-tango-primary"
                >
                  <User size={18} className="mr-1" />
                  <span>{authState.user?.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-4 text-sm text-gray-600 hover:text-tango-primary flex items-center"
                >
                  <LogOut size={18} className="mr-1" />
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/auth?mode=login" 
                  className="text-sm font-medium text-gray-700 hover:text-tango-primary flex items-center"
                >
                  <LogIn size={18} className="mr-1" />
                  {t.login}
                </Link>
                <Link 
                  to="/auth?mode=register" 
                  className="tango-button text-sm"
                >
                  {t.register}
                </Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/home" 
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.home}
              </Link>
              <Link 
                to="/locals" 
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.locals}
              </Link>
              <Link 
                to="/events" 
                className="px-4 py-2 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.events}
              </Link>
              
              {authState.isAuthenticated ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="px-4 py-2 hover:bg-gray-50 rounded flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={18} className="mr-2" />
                    {t.favorites}
                  </Link>
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 hover:bg-gray-50 rounded flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    {t.profile}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-left hover:bg-gray-50 rounded flex items-center text-gray-700"
                  >
                    <LogOut size={18} className="mr-2" />
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth?mode=login" 
                    className="px-4 py-2 hover:bg-gray-50 rounded flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} className="mr-2" />
                    {t.login}
                  </Link>
                  <Link 
                    to="/auth?mode=register" 
                    className="tango-button mx-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.register}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
