
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

  // Add Mallorca to the cities data
  const mallorcaCity: City = {
    id: 'mallorca',
    name: 'Mallorca',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    active: true
  };

  // Add Málaga manually to ensure it's included
  const malagaCity: City = {
    id: 'malaga',
    name: 'Málaga',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1591704066868-eb6f858db842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    active: true
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getCities();
        // Filter to only include Madrid, and add Málaga and Mallorca
        const madridCity = citiesData.find(city => city.name === 'Madrid');
        
        const selectedCities = [];
        if (madridCity) selectedCities.push(madridCity);
        selectedCities.push(malagaCity, mallorcaCity);
        
        setCities(selectedCities);
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
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Center the welcome section in the middle of the screen */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center my-auto pt-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient font-darker">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-darker">
            {t.subtitle}
          </p>
          
          {/* Moved the city selection title closer to the welcome section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-medium mb-8 font-darker">{t.selectCity}</h2>
          </motion.div>
        </motion.div>

        {/* Push the city cards section more to the bottom but still connected to the title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16 mt-4"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
          className="text-center text-gray-600 text-sm mb-8"
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
