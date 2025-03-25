
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Local } from '../../types';

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

  return (
    <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-tango-primary/10 p-2 rounded-full">
            <Clock className="text-tango-primary h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold">{t.scheduleFor}</h2>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-cols-7 gap-3 min-w-[640px]">
            {orderedDays.map((day, index) => {
              const scheduleForDay = local.schedule?.find(s => s.day.toLowerCase() === day.toLowerCase());
              
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${index === 0 ? 'bg-tango-secondary/20 border-tango-primary/20' : 'bg-white'}`}
                >
                  <h3 className={`text-center font-semibold mb-2 ${index === 0 ? 'text-tango-primary' : ''}`}>
                    {day}
                    {index === 0 && <span className="block text-xs mt-1">({t.today})</span>}
                  </h3>
                  {scheduleForDay ? (
                    <div className="text-center">
                      <div className="text-sm">
                        <Clock size={14} className="inline mr-1 text-tango-primary" />
                        {scheduleForDay.openTime} - {scheduleForDay.closeTime}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
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
