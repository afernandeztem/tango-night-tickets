
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
  const { setSelectedCity, state, setLanguage } = useApp();
  
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    navigate('/home');
  };
  
  const orderedCities = getOrderedCities(cities);
  
  const translations = {
    en: {
      title: "Your Night, Your Way",
      selectCity: "Select Your City",
      language: "English"
    },
    es: {
      title: "Tu Noche, A Tu Manera",
      selectCity: "Elige Tu Ciudad",
      language: "Español"
    }
  };
  
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];
  
  const t = translations[state.language];
  
  // Debug the city data
  console.log("Cities from API:", cities);
  console.log("Ordered Cities:", orderedCities);
  
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  
  return (
    <AuroraBackground className="p-0 justify-start">
      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center min-h-screen">
        {/* Language Selector */}
        <div className="self-end mb-4 relative">
          <button 
            className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors text-sm font-medium"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            {t.language}
          </button>
          
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 py-1">
              {languageOptions.map(lang => (
                <button
                  key={lang.code}
                  className={`block w-full text-left px-4 py-2 text-sm ${state.language === lang.code ? 'bg-tango-secondary text-tango-primary' : 'hover:bg-gray-100'}`}
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
          <TitleSection title={t.title} />
          
          {/* City Selection */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-medium text-gray-800">{t.selectCity}</h2>
          </div>
          
          {/* City Grid */}
          <CityGrid 
            cities={orderedCities} 
            onCitySelect={handleCitySelect} 
            isLoading={isLoading}
          />
        </motion.div>
        
        {/* Footer */}
        <PageFooter />
      </div>
    </AuroraBackground>
  );
};

export default Index;
