
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '../EventCard';
import { Event } from '../../types';
import ScrollableSection from '../ScrollableSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventsCardProps {
  events: Event[];
  loading: boolean;
  viewAllLink: string;
  translations: {
    upcomingEventsAt: string;
    viewAll: string;
    noEvents: string;
  };
  favorites?: string[];
}

const EventsCard: React.FC<EventsCardProps> = ({ 
  events, 
  loading, 
  viewAllLink, 
  translations: t,
  favorites = [] 
}) => {
  const hasEvents = events.length > 0;
  const isMobile = useIsMobile();

  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-tango-primary/10 p-2 rounded-full">
              <Calendar className="text-tango-primary h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">{t.upcomingEventsAt}</h2>
          </div>
          {hasEvents && (
            <a 
              href={viewAllLink} 
              className="text-tango-primary font-medium hover:underline flex items-center"
            >
              {t.viewAll}
              <ChevronRight size={16} className="ml-1" />
            </a>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3 bg-white rounded-b-lg">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : hasEvents ? (
          isMobile ? (
            <ScrollableSection
              title=""
              viewAllText=""
              viewAllLink=""
              isLoading={false}
              hasMore={events.length > 1}
            >
              {events.slice(0, 3).map(event => (
                <EventCard 
                  key={event.id}
                  event={event} 
                  isFavorite={favorites.includes(event.id)}
                />
              ))}
            </ScrollableSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map(event => (
                <motion.div 
                  key={event.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventCard 
                    event={event} 
                    isFavorite={favorites.includes(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar size={40} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium">{t.noEvents}</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for upcoming events at this venue.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
