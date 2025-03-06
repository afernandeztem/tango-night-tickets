
import React, { useState } from 'react';
import { City } from '../types';
import { ChevronDown, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { getCities } from '../services/api';
import { useApp } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';

interface CitySelectorProps {
  onSelectCity?: (city: City) => void;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onSelectCity, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, setSelectedCity } = useApp();
  
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsOpen(false);
    if (onSelectCity) onSelectCity(city);
  };

  const translations = {
    en: {
      changeCity: 'Change City',
      selectCity: 'Select a City',
      loading: 'Loading cities...'
    },
    es: {
      changeCity: 'Cambiar Ciudad',
      selectCity: 'Selecciona una Ciudad',
      loading: 'Cargando ciudades...'
    }
  };

  const t = translations[state.language];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`flex items-center gap-1 text-sm hover:text-tango-primary transition-colors ${className}`}
      >
        <MapPin size={16} />
        {state.selectedCity?.name || 'Select City'}
        <ChevronDown size={14} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold mb-4">{t.selectCity}</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-tango-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {cities.filter(city => city.active).map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`p-3 rounded-md border transition-all flex flex-col items-center justify-center text-center hover:border-tango-primary hover:shadow-md ${
                    state.selectedCity?.id === city.id ? 'border-tango-primary bg-tango-secondary/20' : 'border-gray-200'
                  }`}
                >
                  <div 
                    className="w-full h-24 rounded-md bg-cover bg-center mb-2" 
                    style={{ backgroundImage: `url(${city.image})` }}
                  ></div>
                  <span className="font-medium">{city.name}</span>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CitySelector;
