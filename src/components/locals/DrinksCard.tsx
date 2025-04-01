
import React from 'react';
import { motion } from 'framer-motion';
import { Beer, GlassWater, Wine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    
    // Handle CategoryEnum values by directly using the CategoryLabelMap
    if (typeof category === 'number' && Object.values(CategoryEnum).includes(category)) {
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
        case CategoryEnum.COPA:
        case CategoryEnum.COPA_PREMIUM:
        case CategoryEnum.CHUPITO:
          return <GlassWater className="text-tango-primary h-5 w-5" />;
        case CategoryEnum.COCTEL:
          return <GlassWater className="text-tango-primary h-5 w-5" />; 
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
    <Card className="mb-8 border-none shadow-lg overflow-hidden bg-white rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-tango-primary/10 p-2 rounded-full">
            <Wine className="text-tango-primary h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t.drinks}</h2>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((category, idx) => (
              <div key={idx} className="animate-pulse bg-gray-50 rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((drink, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : hasDrinks ? (
          <div className="space-y-8">
            {Object.entries(drinksByCategory).map(([category, categoryDrinks], categoryIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
                  <div className="bg-tango-primary/10 p-1.5 rounded-full">
                    {getCategoryIcon(categoryDrinks[0]?.category)}
                  </div>
                  <Badge variant="outline" className="bg-tango-primary/10 text-tango-primary border-0 py-1 px-3">
                    {category}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryDrinks.map((drink, drinkIndex) => (
                    <motion.div 
                      key={drink.id || drinkIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: drinkIndex * 0.05 }}
                      className="flex justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-tango-primary/20 hover:shadow-md transition-all"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800">{drink.name}</h4>
                        {drink.description && (
                          <p className="text-sm text-gray-500 mt-1">{drink.description}</p>
                        )}
                      </div>
                      <div className="bg-tango-primary/10 text-tango-primary font-semibold px-3 py-1 rounded-full text-sm self-start">
                        {drink.price?.toFixed(2) || "0.00"} €
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Wine size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium">{t.noDrinksAvailable}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrinksCard;
