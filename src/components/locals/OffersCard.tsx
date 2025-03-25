
import React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Offer {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

interface OffersCardProps {
  offers: Offer[];
  loading: boolean;
  translations: {
    offers: string;
    noOffersAvailable: string;
  };
}

const OffersCard: React.FC<OffersCardProps> = ({ offers, loading, translations: t }) => {
  const hasOffers = offers.length > 0;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-tango-primary/10 p-2 rounded-full">
          <PartyPopper className="text-tango-primary h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold">{t.offers}</h2>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-50 rounded-lg p-5">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : hasOffers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-300 border border-gray-100 group"
            >
              <div className="p-0.5 bg-tango-primary"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 group-hover:text-tango-primary transition-colors">
                    {offer.name}
                  </h4>
                  <Badge variant="outline" className="bg-tango-primary/10 text-tango-primary border-tango-primary/20 font-medium">
                    {offer.price?.toFixed(2) || "0.00"} €
                  </Badge>
                </div>
                {offer.description && (
                  <p className="text-gray-600 text-sm">{offer.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <PartyPopper size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">{t.noOffersAvailable}</p>
        </div>
      )}
    </div>
  );
};

export default OffersCard;
