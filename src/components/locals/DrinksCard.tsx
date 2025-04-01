
import React from 'react';
import { motion } from 'framer-motion';
import { Beer, Cocktail, Wine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Drink } from '../../types';
import { CategoryEnum, CategoryLabelMap } from '../../types/CategoryEnum';

interface DrinksCardProps {
  drinks: Drink[];
  loading: boolean;
  translations: {
    drinks: string;
    noDrinksAvailable: string;
  };
}

const DrinksCard: React.FC<DrinksCardProps> = ({ drinks, loading, translations: t }) => {
  const hasDrinks = drinks.length > 0;

  const getCategoryName = (category: CategoryEnum | number | undefined) => {
    if (category === undefined) return 'Other';
    
    // Handle CategoryEnum values
    if (typeof category === 'number' && category in CategoryEnum) {
      return CategoryLabelMap[category as CategoryEnum];
    }
    
    // Fallback for any other number values
    return 'Other';
  };
  
  const getCategoryIcon = (category: CategoryEnum | number | undefined) => {
    if (category === undefined) return <Wine className="text-tango-primary h-5 w-5" />;
    
    if (typeof category === 'number') {
      switch (category) {
        case CategoryEnum.CERVEZA:
          return <Beer className="text-tango-primary h-5 w-5" />;
        case CategoryEnum.COCTEL:
          return <Cocktail className="text-tango-primary h-5 w-5" />;
        case CategoryEnum.VINO:
          return <Wine className="text-tango-primary h-5 w-5" />;
        default:
          return <Wine className="text-tango-primary h-5 w-5" />;
      }
    }
    
    return <Wine className="text-tango-primary h-5 w-5" />;
  };

  const drinksByCategory = drinks.reduce((acc, drink) => {
    const categoryName = getCategoryName(drink.category);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(drink);
    return acc;
  }, {} as Record<string, Drink[]>);

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-tango-primary/10 p-2 rounded-full">
          <Wine className="text-tango-primary h-5 w-5" />
        </div>
        <h2 className="text-2xl font-semibold">{t.drinks}</h2>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((category, idx) => (
            <div key={idx} className="animate-pulse bg-gray-50 rounded-lg p-5">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((drink, index) => (
                  <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : hasDrinks ? (
        <div className="space-y-6">
          {Object.entries(drinksByCategory).map(([category, categoryDrinks], categoryIndex) => (
            <div 
              key={category}
              className="bg-gray-50 p-5 rounded-lg border border-gray-100"
            >
              <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center gap-2">
                <div className="bg-tango-primary/10 p-1.5 rounded-full">
                  {getCategoryIcon(categoryDrinks[0]?.category)}
                </div>
                <Badge className="bg-tango-primary text-white border-0">
                  {category}
                </Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryDrinks.map((drink, drinkIndex) => (
                  <motion.div 
                    key={drink.id || drinkIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: drinkIndex * 0.05 }}
                    className="flex justify-between p-3 rounded-md bg-white border border-gray-100 hover:border-tango-primary/20 transition-colors shadow-sm"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{drink.name}</h4>
                      {drink.description && (
                        <p className="text-sm text-gray-500 mt-1">{drink.description}</p>
                      )}
                    </div>
                    <div className="bg-tango-primary/10 text-tango-primary font-medium px-3 py-1 rounded-full text-sm self-start">
                      {drink.price?.toFixed(2) || "0.00"} €
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Wine size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">{t.noDrinksAvailable}</p>
        </div>
      )}
    </div>
  );
};

export default DrinksCard;
