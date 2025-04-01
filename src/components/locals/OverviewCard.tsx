
import React from 'react';
import { Info, MapPin, Users, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Local } from '../../types';
import { Button } from '@/components/ui/button';

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
    <Card className="mb-8 border-none shadow-lg overflow-hidden bg-white rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.venue} <span className="text-gradient bg-gradient-to-r from-tango-primary to-tango-secondary">Overview</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-gray-700 mb-8 leading-relaxed text-base">
              {local.description || t.noDescription}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {tagsArray.map((tag, index) => (
                <Badge 
                  key={index} 
                  className="bg-gradient-to-r from-tango-primary/20 to-tango-primary/5 hover:from-tango-primary/30 hover:to-tango-primary/10 text-tango-primary uppercase text-xs tracking-wider font-medium py-1.5 px-4 border-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200 flex items-center">
              <span className="text-gradient bg-gradient-to-r from-tango-primary to-tango-secondary mr-2">{t.venue}</span> {t.information}
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t.address}</h4>
                <p className="flex items-start">
                  <div className="bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 p-2 rounded-full shadow-sm mr-3 mt-0.5">
                    <MapPin size={16} className="text-tango-primary" />
                  </div>
                  <span className="text-gray-700">{local.address}, {local.city}</span>
                </p>
              </div>
              
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t.capacityInfo}</h4>
                <p className="flex items-start">
                  <div className="bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 p-2 rounded-full shadow-sm mr-3 mt-0.5">
                    <Users size={16} className="text-tango-primary" />
                  </div>
                  <span className="text-gray-700">{local.capacity} {t.capacity}</span>
                </p>
              </div>
              
              <Button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`, '_blank')}
                className="w-full mt-6 bg-gradient-to-r from-tango-primary to-tango-secondary hover:from-tango-primary/90 hover:to-tango-secondary/90 text-white px-4 py-6 rounded-lg transition-all shadow-md flex items-center justify-center h-auto"
              >
                <Navigation size={18} className="mr-2" />
                {t.getDirections}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
