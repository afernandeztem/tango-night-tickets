import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/ui/aurora-background';
import { getCities } from '../services/api';
import { City } from '../types';
import { useApp } from '../context/AppContext';
import CityCard from '../components/CityCard';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedCity, state } = useApp();

  const translations = {
    en: {
      title: 'Welcome to TangoApp',
      subtitle: 'Discover nightlife, buy tickets, and enjoy the night!',
      selectCity: 'Select Your City',
      availableWorldwide: 'Available in multiple cities worldwide'
    },
    es: {
      title: 'Bienvenido a TangoApp',
      subtitle: 'Descubre la vida nocturna, compra entradas y disfruta la noche!',
      selectCity: 'Elige Tu Ciudad',
      availableWorldwide: 'Disponible en múltiples ciudades en todo el mundo'
    }
  };

  const t = translations[state.language];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getCities();
        setCities(citiesData.filter(city => city.active));
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    navigate('/home');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <AuroraBackground>
      <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient font-darker">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-darker">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-medium text-center mb-8 font-darker">{t.selectCity}</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city, index) => (
                <motion.div
                  key={city.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CityCard city={city} onClick={handleCitySelect} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-gray-600 text-sm"
        >
          <p className="flex items-center justify-center">
            <Globe className="h-4 w-4 mr-2" />
            {t.availableWorldwide}
          </p>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default LandingPage;
