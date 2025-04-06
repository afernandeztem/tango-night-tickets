
import { City } from '../types';

// Cities in the specific order requested: Mallorca, Madrid, Málaga
export const ORDERED_CITY_KEYS = ["Mallorca", "Madrid", "Málaga"];

export const getOrderedCities = (cities: City[]): City[] => {
  if (!cities || cities.length === 0) return [];
  
  // First add the cities in the specified order
  let orderedCities: City[] = [];
  
  // Add specific cities first in the requested order
  ORDERED_CITY_KEYS.forEach(cityName => {
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
