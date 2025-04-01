
import React from 'react';
import { Clock, MapPin, Users, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Local, LocalSchedule, ScheduleObject } from '../../types';

interface ScheduleCardProps {
  local: Local;
  translations: {
    scheduleFor: string;
    closed: string;
    today: string;
    address: string;
    venue: string;
    information: string;
    capacity: string;
    capacityInfo: string;
    getDirections: string;
  };
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ local, translations: t }) => {
  const getDaysOfWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const orderedDays = [...days.slice(today === 0 ? 6 : today - 1), ...days.slice(0, today === 0 ? 6 : today - 1)];
    return orderedDays;
  };

  const orderedDays = getDaysOfWeek();

  // Process the schedule data based on its format
  const getScheduleForDay = (day: string): LocalSchedule | null => {
    if (!local || !local.schedule) return null;
    
    // If schedule is an array (old format)
    if (Array.isArray(local.schedule)) {
      return local.schedule.find(s => s.day.toLowerCase() === day.toLowerCase()) || null;
    }
    
    // If schedule is an object with day keys (new format)
    const scheduleObj = local.schedule as ScheduleObject;
    const dayKey = day.toLowerCase();
    
    if (
      scheduleObj[dayKey] && 
      Array.isArray(scheduleObj[dayKey]) && 
      scheduleObj[dayKey].length >= 2
    ) {
      const times = scheduleObj[dayKey] as string[];
      return {
        day: day,
        openTime: times[0].slice(0, 5), // "18:00:00" -> "18:00"
        closeTime: times[1].slice(0, 5), // "04:00:00" -> "04:00"
      };
    }
    
    return null;
  };

  return (
    <Card className="mb-8 border border-gray-100 shadow-lg overflow-hidden bg-white rounded-xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Venue Information Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200 flex items-center">
              <MapPin size={18} className="mr-2 text-tango-primary" />
              {t.venue} {t.information}
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">{t.address}</h4>
                <p className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.address}, {local.city}</span>
                </p>
              </div>
              
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1.5">{t.capacityInfo}</h4>
                <p className="flex items-start">
                  <Users size={18} className="mr-3 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.capacity} {t.capacity}</span>
                </p>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 bg-tango-primary text-white px-4 py-3 rounded-lg hover:bg-tango-primary/90 transition-colors flex items-center justify-center shadow-sm"
              >
                <Navigation size={16} className="mr-2" />
                {t.getDirections}
              </a>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200 flex items-center">
              <Clock size={18} className="mr-2 text-tango-primary" />
              {t.scheduleFor}
            </h3>
            
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-7 gap-2 min-w-[480px]">
                {orderedDays.map((day, index) => {
                  const scheduleForDay = getScheduleForDay(day);
                  const isToday = index === 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-2 rounded-lg border ${isToday ? 'bg-tango-primary/10 border-tango-primary/20' : 'bg-white'}`}
                    >
                      <h3 className={`text-center font-semibold mb-2 text-sm ${isToday ? 'text-tango-primary' : ''}`}>
                        {day}
                        {isToday && <span className="block text-xs mt-1">({t.today})</span>}
                      </h3>
                      {scheduleForDay ? (
                        <div className="text-center">
                          <div className="text-xs">
                            <Clock size={12} className="inline mr-1 text-tango-primary" />
                            {scheduleForDay.openTime} - {scheduleForDay.closeTime}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 text-xs">
                          {t.closed}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
