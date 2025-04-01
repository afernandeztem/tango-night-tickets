
import React from 'react';
import { Info, MapPin, Users, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Local } from '../../types';

interface OverviewCardProps {
  local: Local;
  translations: {
    address: string;
    venue: string;
    information: string;
    capacity: string;
    capacityInfo: string;
    getDirections: string;
    noDescription: string;
  };
}

const OverviewCard: React.FC<OverviewCardProps> = ({ local, translations: t }) => {
  // Make sure tags is an array
  const tagsArray = Array.isArray(local.tags) ? local.tags : (local.tags ? [local.tags] : []);
  
  return (
    <Card className="mb-8 border border-gray-100 shadow-lg overflow-hidden bg-white rounded-xl">
      <CardContent className="p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold">
            <span className="text-gray-800">{t.venue}</span> <span className="text-tango-primary">Overview</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {tagsArray.map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-tango-primary/10 hover:bg-tango-primary/20 text-tango-primary uppercase text-xs tracking-wider font-medium py-1.5 px-3 border-none"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-gray-700 mb-8 leading-relaxed text-lg">
            {local.description || t.noDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
