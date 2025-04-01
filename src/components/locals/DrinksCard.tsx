
import React from 'react';
import { motion } from 'framer-motion';
import { Beer, GlassWater, Wine } from 'lucide-react';
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

  // Header section with title
  const renderHeader = () => (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-tango-primary/10 p-3 rounded-full shadow-sm">
        <Wine className="text-tango-primary h-6 w-6" />
      </div>
      <h2 className="text-2xl font-semibold text-gradient">{t.drinks}</h2>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div>
        {renderHeader()}
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
      </div>
    );
  }

  // No drinks available
  if (!hasDrinks) {
    return (
      <div>
        {renderHeader()}
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Wine size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">{t.noDrinksAvailable}</p>
        </div>
      </div>
    );
  }

  // Main drinks display with enhanced styling
  return (
    <div>
      {renderHeader()}
      <div className="space-y-8">
        {Object.entries(drinksByCategory).map(([category, categoryDrinks], categoryIndex) => (
          <div 
            key={category}
            className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-medium mb-5 text-gray-800 flex items-center gap-2">
              <div className="bg-tango-primary/10 p-2 rounded-full">
                {getCategoryIcon(categoryDrinks[0]?.category)}
              </div>
              <Badge className="bg-tango-primary/90 hover:bg-tango-primary text-white border-0 py-1.5 px-3 text-sm font-medium shadow-sm">
                {category}
              </Badge>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryDrinks.map((drink, drinkIndex) => (
                <motion.div 
                  key={drink.id || drinkIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: drinkIndex * 0.05 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-tango-primary/5 to-tango-primary/10 rounded-lg transform scale-[0.97] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-10"></div>
                  
                  <div className="flex justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-tango-primary/30 transition-all duration-300 shadow-sm hover:shadow">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 group-hover:text-tango-primary transition-colors">
                        {drink.name}
                      </h4>
                      {drink.description && (
                        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                          {drink.description.split('-').map((part, i) => 
                            part.trim() ? (
                              <span key={i} className="inline-block mr-1">
                                {part.trim()}{i < drink.description!.split('-').length - 1 && part.trim() ? ' • ' : ''}
                              </span>
                            ) : null
                          )}
                        </p>
                      )}
                    </div>
                    <div className="bg-tango-primary/10 text-tango-primary font-medium px-3 py-1.5 rounded-full text-sm self-start whitespace-nowrap flex items-center justify-center min-w-[70px]">
                      {drink.price?.toFixed(2) || "0.00"} €
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrinksCard;
