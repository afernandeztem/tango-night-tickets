
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DrinksCard from './DrinksCard';
import OffersCard from './OffersCard';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drink } from '../../types';

interface Offer {
  id: string;
  name: string;
  description?: string;
  price?: number;
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
  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* Offers Section */}
        <OffersCard 
          offers={offers}
          loading={loadingOffers}
          translations={translations}
        />
        
        {/* Separator between sections */}
        {offers.length > 0 && drinks.length > 0 && (
          <Separator className="my-6" />
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
