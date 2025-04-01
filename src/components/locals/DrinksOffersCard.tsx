
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DrinksCard from './DrinksCard';
import OffersCard from './OffersCard';
import { Drink } from '../../types';
import { CategoryEnum, CategoryLabelMap } from '../../types/CategoryEnum';

interface Offer {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: CategoryEnum | number;
}

interface DrinksOffersCardProps {
  drinks: Drink[];
  offers: Offer[];
  loadingDrinks: boolean;
  loadingOffers: boolean;
  translations: {
    drinks: string;
    offers: string;
    noDrinksAvailable: string;
    noOffersAvailable: string;
  };
}

const DrinksOffersCard: React.FC<DrinksOffersCardProps> = ({ 
  drinks, 
  offers, 
  loadingDrinks, 
  loadingOffers, 
  translations 
}) => {
  // Group offers by category
  const groupedOffers = React.useMemo(() => {
    const grouped: Record<string, Offer[]> = {};
    
    offers.forEach(offer => {
      const category = typeof offer.category === 'number' ? offer.category : CategoryEnum.OTRO;
      const categoryKey = category.toString();
      
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }
      
      grouped[categoryKey].push(offer);
    });
    
    return grouped;
  }, [offers]);
  
  // Get ordered categories for display
  const categories = React.useMemo(() => {
    return Object.keys(groupedOffers)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedOffers]);
  
  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* Offers Section - Grouped by Category */}
        {loadingOffers ? (
          <OffersCard 
            offers={[]}
            loading={true}
            translations={translations}
          />
        ) : categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map(categoryNum => (
              <OffersCard 
                key={categoryNum}
                offers={groupedOffers[categoryNum]}
                loading={false}
                category={categoryNum}
                translations={translations}
              />
            ))}
          </div>
        ) : (
          <OffersCard 
            offers={[]}
            loading={false}
            translations={translations}
          />
        )}

        {/* Drinks Section */}
        <DrinksCard 
          drinks={drinks}
          loading={loadingDrinks}
          translations={translations}
        />
      </CardContent>
    </Card>
  );
};

export default DrinksOffersCard;
