
import React from 'react';
import { Info, MapPin, Users, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="mb-8 border-none shadow-xl overflow-hidden bg-white rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-tango-primary pb-1">
            {t.venue} <span className="text-tango-primary">Overview</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-gray-700 mb-8 leading-relaxed text-base">
              {local.description || t.noDescription}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {tagsArray.map((tag, index) => (
                <span 
                  key={index} 
                  className="uppercase text-xs tracking-wider text-tango-primary font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner">
            <h3 className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200 flex items-center">
              <Info size={16} className="mr-2 text-tango-primary" />
              {t.venue} {t.information}
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">{t.address}</h4>
                <p className="flex items-start group-hover:text-tango-primary transition-colors duration-200">
                  <MapPin size={18} className="mr-3 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.address}, {local.city}</span>
                </p>
              </div>
              
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">{t.capacityInfo}</h4>
                <p className="flex items-start group-hover:text-tango-primary transition-colors duration-200">
                  <Users size={18} className="mr-3 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.capacity} {t.capacity}</span>
                </p>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 bg-gradient-to-r from-tango-primary to-tango-primary/90 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Navigation size={16} className="mr-2" />
                {t.getDirections}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
