
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCities } from '@/services/api';
import { useApp } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { AuroraBackground } from "@/components/ui/aurora-background";
import TangoHero from "../components/TangoHero";
import TitleSection from "../components/TitleSection";
import CityGrid from "../components/CityGrid";
import PageFooter from "../components/PageFooter";
import { getOrderedCities } from "../utils/cityUtils";

const Index = () => {
  const navigate = useNavigate();
  const { setSelectedCity } = useApp();
  
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    navigate('/home');
  };
  
  const orderedCities = getOrderedCities(cities);
  
  // Debug the city data
  console.log("Cities from API:", cities);
  console.log("Ordered Cities:", orderedCities);
  
  return (
    <div className="relative min-h-screen">
      {/* Background with lower z-index */}
      <div className="absolute inset-0 z-0">
        <AuroraBackgroundSimple />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center min-h-screen">
        {/* Logo and Tagline */}
        <TangoHero />
        
        {/* Content Container */}
        <motion.div
          className="w-full max-w-4xl mx-auto space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <TitleSection title="Your Night, Your Way" />
          
          {/* City Selection */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              Select Your City
            </h2>
            <CityGrid 
              cities={orderedCities} 
              onCitySelect={handleCitySelect} 
              isLoading={isLoading}
            />
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="mt-auto">
          <PageFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;
