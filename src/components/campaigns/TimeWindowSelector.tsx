
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeWindowOption } from '@/lib/types';

interface TimeWindowSelectorProps {
  value: TimeWindowOption;
  onChange: (window: TimeWindowOption) => void;
  className?: string;
}

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const weekdays = [
    { value: 0, label: "Sunday", abbr: "Sun" },
    { value: 1, label: "Monday", abbr: "Mon" },
    { value: 2, label: "Tuesday", abbr: "Tue" },
    { value: 3, label: "Wednesday", abbr: "Wed" },
    { value: 4, label: "Thursday", abbr: "Thu" },
    { value: 5, label: "Friday", abbr: "Fri" },
    { value: 6, label: "Saturday", abbr: "Sat" }
  ];

  const presets: TimeWindowOption[] = [
    {
      label: "Standard Business Hours",
      startTime: "09:00",
      endTime: "17:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    },
    {
      label: "Extended Business Hours",
      startTime: "08:00",
      endTime: "19:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    },
    {
      label: "All Week Business Hours",
      startTime: "09:00",
      endTime: "17:00",
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All week
    },
    {
      label: "Late Morning to Evening",
      startTime: "10:00",
      endTime: "20:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    }
  ];

  const handleDayToggle = (day: number) => {
    const newDays = value.daysOfWeek.includes(day)
      ? value.daysOfWeek.filter(d => d !== day)
      : [...value.daysOfWeek, day].sort((a, b) => a - b);
    
    onChange({
      ...value,
      daysOfWeek: newDays
    });
  };

  const applyPreset = (preset: TimeWindowOption) => {
    onChange({
      ...preset
    });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Quick Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-2 py-1 border rounded-md hover:bg-muted transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="time" 
                value={value.startTime} 
                onChange={(e) => onChange({...value, startTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>End Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="time" 
                value={value.endTime} 
                onChange={(e) => onChange({...value, endTime: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Active Days</Label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`day-${day.value}`} 
                  checked={value.daysOfWeek.includes(day.value)}
                  onCheckedChange={() => handleDayToggle(day.value)}
                />
                <label
                  htmlFor={`day-${day.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day.abbr}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select the days of the week when messages can be sent
          </p>
        </div>
        
        <Card className="p-3 bg-muted/50">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Current Setting:</div>
            <p>
              Sending from {value.startTime} to {value.endTime} on{' '}
              {value.daysOfWeek.length === 7 
                ? 'all days' 
                : value.daysOfWeek.length === 0
                  ? 'no days (please select at least one day)'
                  : value.daysOfWeek.map(d => weekdays.find(w => w.value === d)?.abbr).join(', ')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeWindowSelector;
