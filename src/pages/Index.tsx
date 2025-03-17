
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full flex flex-col items-center"
        >
          {/* Even larger logo */}
          <div className="flex justify-center mb-10">
            <TangoLogo variant="full" className="h-40 w-auto" linkTo={null} />
          </div>
          
          {/* Improved tagline */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl md:text-4xl text-center text-gray-700 mb-6 font-darker font-bold"
          >
            Your Night, Your Way
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-center text-gray-600 mb-10 font-darker"
          >
            Discover nightlife, buy tickets, and enjoy the night!
          </motion.p>
          
          {/* Cities grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full"
          >
            <h2 className="text-2xl font-medium mb-6 text-center font-darker">Select Your City</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {cities.filter(city => city.active).map((city, index) => (
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
        </motion.div>
        
        {/* Footer copyright */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TangoApp • The best way to enjoy nightlife</p>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default Index;
