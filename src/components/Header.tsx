
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, ShoppingCart, User, X, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  // Track scrolling for transparent/solid header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Locals', path: '/locals' },
    { name: 'Events', path: '/events' }
  ];

  const toggleLanguage = () => {
    // This would trigger language change in a real app
    alert('Language toggle functionality would go here');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-tango-primary flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="ml-2 text-xl font-medium">TangoApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section - Icons */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-gray-700 hover:text-tango-primary focus:outline-none"
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Favorites - only show if logged in */}
            {auth.isAuthenticated && (
              <Link to="/favorites" className="text-gray-700 hover:text-tango-primary">
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/checkout" className="text-gray-700 hover:text-tango-primary relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-tango-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {auth.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-tango-primary focus:outline-none"
                >
                  <User className="h-5 w-5" />
                  <span className="ml-2 hidden md:block">{auth.user?.name || 'User'}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-tango-secondary"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/favorites" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-tango-secondary"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-tango-secondary"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/auth/login" 
                  className="text-tango-primary hover:underline"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/register" 
                  className="tango-button"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-3 rounded-md ${
                  location.pathname === link.path 
                    ? 'bg-tango-secondary text-tango-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!auth.isAuthenticated && (
              <>
                <Link
                  to="/auth/login"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block py-2 px-3 bg-tango-primary text-white rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
