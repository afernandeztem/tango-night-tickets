
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import TangoLogo from "@/components/TangoLogo";
import { getCities } from '@/services/api';
import { City } from '../types';
import CityCard from "../components/CityCard";
import { useApp } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const navigate = useNavigate();
  const { setSelectedCity } = useApp();
  
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    navigate('/home');
  };

  // Images for specific cities
  const cityImages = {
    "Mallorca": "/lovable-uploads/ef5441d4-75e2-4dfc-ab8d-cbfdc643c817.png",
    "Madrid": "/lovable-uploads/4f8e6975-420c-4da2-a72b-4ec77749e585.png",
    "Málaga": "/lovable-uploads/666cb45c-d92f-4a88-bf1a-a9e317c3c3d4.png"
  };
  
  // Custom animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Cities in the specific order requested: Mallorca, Madrid, Málaga
  const orderedCityKeys = ["Mallorca", "Madrid", "Málaga"];
  
  const getOrderedCities = () => {
    if (!cities || cities.length === 0) return [];
    
    // First add the cities in the specified order
    let orderedCities: City[] = [];
    
    // Add specific cities first in the requested order
    orderedCityKeys.forEach(cityName => {
      const foundCity = cities.find(c => 
        c.name.toLowerCase() === cityName.toLowerCase() && c.active
      );
      if (foundCity) orderedCities.push(foundCity);
    });
    
    // Then add any remaining active cities
    cities.forEach(city => {
      if (
        city.active && 
        !orderedCities.some(c => c.id === city.id)
      ) {
        orderedCities.push(city);
      }
    });
    
    return orderedCities;
  };
  
  const orderedCities = getOrderedCities();
  
  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl w-full flex flex-col items-center"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex justify-center mb-12"
          >
            <TangoLogo variant="full" className="h-40 w-auto" linkTo={null} />
          </motion.div>
          
          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.8,
              ease: "easeOut" 
            }}
            className="text-4xl md:text-5xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-tango-primary to-tango-secondary mb-6 font-darker"
          >
            Your Night, Your Way
          </motion.h1>

          {/* Tagline with animated underline */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="relative mb-16"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-center text-gray-600 font-darker mb-3"
            >
              Discover nightlife, buy tickets, and enjoy the night!
            </motion.p>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="h-0.5 w-32 bg-gradient-to-r from-tango-primary to-tango-secondary mx-auto"
            />
          </motion.div>
          
          {/* Cities section */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full"
          >
            <motion.h2 
              variants={item}
              className="text-2xl font-semibold mb-8 text-center font-darker relative inline-block"
            >
              <span className="relative z-10">Select Your City</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-0 left-0 h-3 bg-tango-secondary opacity-20 z-0"
              />
            </motion.h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={container}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                {orderedCities.map((city, index) => (
                  <motion.div
                    key={city.id}
                    variants={item}
                    custom={index}
                    whileHover={{ z: 10 }}
                  >
                    <CityCard 
                      city={city} 
                      onClick={handleCitySelect}
                      imagePath={cityImages[city.name as keyof typeof cityImages]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TangoApp • The best way to enjoy nightlife</p>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
