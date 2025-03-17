
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCities } from '@/services/api';
import { useApp } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import AuroraBackgroundSimple from "../components/AuroraBackgroundSimple";
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

  // Fixed image paths for the cities
  const cityImages: Record<string, string> = {
    "Mallorca": "/lovable-uploads/7b083dda-f18a-41ea-bb7c-be54008d68e6.png",
    "Madrid": "/lovable-uploads/9bb4f081-0611-4b1e-b862-cd47a10c00ae.png",
    "Málaga": "/lovable-uploads/df7b178d-c9cf-4323-aaea-b856a275c91c.png"
  };
  
  const orderedCities = getOrderedCities(cities);
  
  // Debug the city images
  console.log("City Images:", cityImages);
  console.log("Ordered Cities:", orderedCities);
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackgroundSimple />

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-12 flex flex-col items-center">
        {/* Logo and Tagline */}
        <TangoHero />
        
        {/* Content Container */}
        <motion.div
          className="w-full max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <TitleSection title="Your Night, Your Way" />
          
          {/* City Selection */}
          <CityGrid 
            cities={orderedCities} 
            onCitySelect={handleCitySelect} 
            cityImages={cityImages}
            isLoading={isLoading}
          />
        </motion.div>
        
        {/* Footer */}
        <PageFooter />
      </div>
    </div>
  );
};

export default Index;
