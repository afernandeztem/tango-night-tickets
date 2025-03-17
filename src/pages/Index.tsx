
import { useNavigate } from "react-router-dom";
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

  // Updated images for specific cities
  const cityImages = {
    "Mallorca": "/lovable-uploads/7b083dda-f18a-41ea-bb7c-be54008d68e6.png",
    "Madrid": "/lovable-uploads/9bb4f081-0611-4b1e-b862-cd47a10c00ae.png",
    "Málaga": "/lovable-uploads/df7b178d-c9cf-4323-aaea-b856a275c91c.png"
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora Background - positioned as a fixed background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-transparent opacity-40"></div>
        <div className="absolute inset-0 [--white:rgba(255,255,255,0.2)] [--black:rgba(0,0,0,0.2)] [--transparent:transparent] [--blue-300:rgba(147,197,253,0.4)] [--blue-400:rgba(96,165,250,0.4)] [--blue-500:rgba(59,130,246,0.4)] [--indigo-300:rgba(165,180,252,0.4)] [--violet-200:rgba(221,214,254,0.4)] [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [background-image:var(--aurora)] [background-size:300%] filter blur-[80px] opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-12 flex flex-col items-center">
        {/* Logo and Tagline with matching animation */}
        <div className="flex flex-col items-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <TangoLogo variant="full" className="h-48 w-auto" linkTo={null} />
          </motion.div>
          
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-xl text-gray-600 mt-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-tango-primary/90 to-tango-secondary/90"
          >
            Discover nightlife, buy tickets, and enjoy the night!
          </motion.p>
        </div>
        
        {/* Content Container */}
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-tango-primary to-tango-secondary">
              Your Night, Your Way
            </h1>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative max-w-md mx-auto"
            >
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="h-0.5 w-28 mx-auto bg-gradient-to-r from-tango-primary to-tango-secondary"
              />
            </motion.div>
          </motion.div>
          
          {/* City Selection */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-10"
          >
            <motion.h2 
              variants={item}
              className="text-xl font-semibold text-center mb-10 relative inline-block mx-auto"
              style={{ display: "table" }}
            >
              <span className="relative z-10">Select Your City</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-0 left-0 h-2 bg-tango-secondary opacity-20 z-0"
              />
            </motion.h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-56 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={container}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {orderedCities.map((city, index) => (
                  <motion.div
                    key={city.id}
                    variants={item}
                    custom={index}
                    className="transform-gpu"
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
        <motion.footer
          className="mt-auto pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TangoApp • The best way to enjoy nightlife</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
