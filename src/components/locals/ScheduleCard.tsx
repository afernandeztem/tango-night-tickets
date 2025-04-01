
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Local, LocalSchedule, ScheduleObject } from '../../types';

interface ScheduleCardProps {
  local: Local;
  translations: {
    scheduleFor: string;
    closed: string;
    today: string;
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
    <Card className="mb-8 border-none shadow-lg overflow-hidden bg-white rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-tr from-tango-primary/20 to-tango-primary/5 p-3 rounded-full shadow-sm">
            <Clock className="text-tango-primary h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-gradient bg-gradient-to-r from-tango-primary to-tango-secondary">Weekly</span> {t.scheduleFor}
          </h2>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-cols-7 gap-3 min-w-[640px]">
            {orderedDays.map((day, index) => {
              const scheduleForDay = getScheduleForDay(day);
              
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border ${index === 0 
                    ? 'bg-gradient-to-br from-tango-primary/20 to-tango-primary/5 border-tango-primary/20 shadow-md' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-50/50 border-gray-100 hover:border-tango-primary/10 hover:shadow-sm transition-all'}`}
                >
                  <h3 className={`text-center font-semibold mb-2 ${index === 0 ? 'text-tango-primary' : ''}`}>
                    {day}
                    {index === 0 && <span className="block text-xs mt-1 bg-tango-primary/10 py-0.5 px-2 rounded-full inline-block">({t.today})</span>}
                  </h3>
                  {scheduleForDay ? (
                    <div className="text-center">
                      <div className="text-sm bg-white py-1.5 px-3 rounded-lg shadow-sm">
                        <Clock size={14} className="inline mr-1 text-tango-primary" />
                        {scheduleForDay.openTime} - {scheduleForDay.closeTime}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm bg-white/80 py-1.5 px-3 rounded-lg">
                      {t.closed}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
