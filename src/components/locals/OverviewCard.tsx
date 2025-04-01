import React from 'react';
import { Info, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Local, LocalSchedule, ScheduleObject } from '../../types';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    today: string;
    closed: string;
    scheduleFor: string;
  };
}

const OverviewCard: React.FC<OverviewCardProps> = ({ local, translations: t }) => {
  // Make sure tags is an array
  const tagsArray = Array.isArray(local.tags) ? local.tags : (local.tags ? [local.tags] : []);
  
  // Get today's schedule
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  const today = getDayOfWeek();
  
  // Process the schedule data to get today's schedule
  const getTodaySchedule = (): LocalSchedule | null => {
    if (!local || !local.schedule) return null;
    
    // If schedule is an array (old format)
    if (Array.isArray(local.schedule)) {
      return local.schedule.find(s => s.day.toLowerCase() === today.toLowerCase()) || null;
    }
    
    // If schedule is an object with day keys (new format)
    const scheduleObj = local.schedule as ScheduleObject;
    const dayKey = today.toLowerCase();
    
    if (
      scheduleObj[dayKey] && 
      Array.isArray(scheduleObj[dayKey]) && 
      scheduleObj[dayKey].length >= 2
    ) {
      const times = scheduleObj[dayKey] as string[];
      return {
        day: today,
        openTime: times[0].slice(0, 5), // "18:00:00" -> "18:00"
        closeTime: times[1].slice(0, 5), // "04:00:00" -> "04:00"
      };
    }
    
    return null;
  };
  
  const todaySchedule = getTodaySchedule();
  
  return (
    <Card className="mb-6 border border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
      <CardContent className="p-6 pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-3">
          <h2 className="text-2xl font-bold">
            <span className="text-gray-800">{t.venue}</span> <span className="text-tango-primary">Overview</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {tagsArray.map((tag, index) => (
              <Badge 
                key={index} 
                className="bg-tango-primary/10 hover:bg-tango-primary/20 text-tango-primary uppercase text-xs tracking-wider font-medium py-1 px-3 border-none"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-gray-700 mb-5 leading-relaxed">
            {local.description || t.noDescription}
          </p>
          
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <MapPin size={18} className="mr-2 text-tango-primary" />
              {t.information}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.address}</h4>
                <p className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.address}, {local.city}</span>
                </p>
              </div>
              
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.capacityInfo}</h4>
                <p className="flex items-start">
                  <Users size={16} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">{local.capacity} {t.capacity}</span>
                </p>
              </div>
              
              <div className="group">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">{t.today}</h4>
                <p className="flex items-start">
                  <Clock size={16} className="mr-2 mt-0.5 text-tango-primary flex-shrink-0" />
                  <span className="text-gray-700">
                    {todaySchedule ? (
                      <>{todaySchedule.openTime} - {todaySchedule.closeTime}</>
                    ) : (
                      <>{t.closed}</>
                    )}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.address + ', ' + local.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-tango-primary text-white px-3 py-2 rounded-md hover:bg-tango-primary/90 transition-colors text-center text-sm"
              >
                {t.getDirections}
              </a>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-tango-primary/10 text-tango-primary hover:bg-tango-primary/20 transition-colors px-3 py-2 rounded-md text-sm">
                    {t.scheduleFor}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t.scheduleFor} {local.name}</DialogTitle>
                  </DialogHeader>
                  <WeekSchedule local={local} translations={t} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add a component for the full week schedule that appears in the dialog
const WeekSchedule: React.FC<{local: Local, translations: any}> = ({ local, translations: t }) => {
  const getDaysOfWeek = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days;
  };

  const days = getDaysOfWeek();
  
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
  
  // Get today's day
  const todayIndex = new Date().getDay();
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][todayIndex];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
      {days.map((day) => {
        const scheduleForDay = getScheduleForDay(day);
        const isToday = day === todayName;
        
        return (
          <div 
            key={day} 
            className={`p-3 rounded-lg border ${isToday ? 'bg-tango-primary/10 border-tango-primary/20' : 'bg-white border-gray-100'}`}
          >
            <h3 className={`font-semibold mb-1 text-sm ${isToday ? 'text-tango-primary' : 'text-gray-700'}`}>
              {day}
              {isToday && <span className="text-xs ml-1.5">({t.today})</span>}
            </h3>
            {scheduleForDay ? (
              <div className="text-sm">
                <Clock size={12} className="inline mr-1 text-tango-primary" />
                {scheduleForDay.openTime} - {scheduleForDay.closeTime}
              </div>
            ) : (
              <div className="text-gray-500 text-xs">
                {t.closed}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCard;
