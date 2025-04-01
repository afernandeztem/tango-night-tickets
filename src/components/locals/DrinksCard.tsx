
import React from 'react';
import { motion } from 'framer-motion';
import { Beer, GlassWater, Wine, Cocktail2 } from 'lucide-react';
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
          return <GlassWater className="text-tango-primary h-5 w-5" />;
        case CategoryEnum.COCTEL:
          return <Cocktail2 className="text-tango-primary h-5 w-5" />; 
        case CategoryEnum.VINO:
          return <Wine className="text-tango-primary h-5 w-5" />;
        case CategoryEnum.CHUPITO:
          return <GlassWater className="text-tango-primary h-6 w-6 -rotate-45" />;
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
          <div className="bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 p-3 rounded-full shadow-sm">
            <Wine className="text-tango-primary h-6 w-6" />
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
                className="bg-gradient-to-br from-gray-50 to-gray-50/50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 p-2 rounded-full shadow-sm">
                    {getCategoryIcon(categoryDrinks[0]?.category)}
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-tango-primary/20 to-tango-primary/5 text-tango-primary border-0 py-1.5 px-4">
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
                      className="flex justify-between p-5 rounded-xl bg-white border border-gray-100 hover:border-tango-primary/20 hover:shadow-md transition-all group"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-tango-primary transition-colors">{drink.name}</h4>
                        {drink.description && (
                          <p className="text-sm text-gray-500 mt-1">{drink.description}</p>
                        )}
                      </div>
                      <div className="bg-gradient-to-r from-tango-primary to-tango-secondary text-white font-semibold px-4 py-1.5 rounded-full text-sm self-start shadow-sm">
                        {drink.price?.toFixed(2) || "0.00"} €
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Wine size={24} className="text-tango-primary" />
            </div>
            <p className="text-gray-700 font-medium">{t.noDrinksAvailable}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrinksCard;
