
import React from 'react';
import { Info, MapPin, Users, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  // Tag colors for diversity - more stylish design
  const tagColors = [
    'bg-gradient-to-r from-violet-100 to-violet-50 text-violet-700 border-violet-200', // Purple
    'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200',         // Blue 
    'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200', // Green
    'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200',      // Amber
    'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border-rose-200',          // Rose
    'bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 border-cyan-200',          // Cyan
    'bg-gradient-to-r from-lime-100 to-lime-50 text-lime-700 border-lime-200',          // Lime
  ];
  
  // Make sure tags is an array
  const tagsArray = Array.isArray(local.tags) ? local.tags : (local.tags ? [local.tags] : []);
  
  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-tango-primary/10 p-2 rounded-full">
            <Info className="text-tango-primary h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold">{t.venue} Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-gray-700 mb-6">
              {local.description || t.noDescription}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {tagsArray.map((tag, index) => (
                <span 
                  key={index} 
                  className={`text-xs px-3 py-1.5 rounded-full ${tagColors[index % tagColors.length]} border shadow-sm font-medium tracking-wide`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">{t.venue} {t.information}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{t.address}</h4>
                <p className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span>{local.address}, {local.city}</span>
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">{t.capacityInfo}</h4>
                <p className="flex items-start">
                  <Users size={18} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span>{local.capacity} {t.capacity}</span>
                </p>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-tango-primary text-white px-4 py-2 rounded-md hover:bg-tango-primary/90 transition-colors flex items-center justify-center shadow-sm mt-2"
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
