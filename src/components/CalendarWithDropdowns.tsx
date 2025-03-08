
"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DayPickerRangeProps, DateRange } from "react-day-picker";

interface CalendarWithDropdownsProps {
  dateRange?: DateRange;
  onSelect?: (dateRange: DateRange | undefined) => void;
  className?: string;
}

const CalendarWithDropdowns: React.FC<CalendarWithDropdownsProps> = ({ 
  dateRange, 
  onSelect,
  className
}) => {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div className={className || "rounded-lg border border-border bg-background"}>
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={onSelect}
        className="p-0"
        captionLayout="dropdown"
        defaultMonth={new Date()}
        components={{
          Dropdown: (props) => {
            return (
              <Select
                value={String(props.value)}
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue>{props.name}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.children}
                </SelectContent>
              </Select>
            );
          },
        }}
      />
    </div>
  );
};

export default CalendarWithDropdowns;
