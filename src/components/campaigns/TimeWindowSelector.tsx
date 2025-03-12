
import React, { useState } from 'react';
import { TimeWindow } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TimeWindowSelectorProps {
  value?: TimeWindow;
  onChange: (window: TimeWindow | undefined) => void;
}

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  const [enabled, setEnabled] = useState(!!value);
  const [startTime, setStartTime] = useState(value?.startTime || '09:00');
  const [endTime, setEndTime] = useState(value?.endTime || '17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>(value?.daysOfWeek || [1, 2, 3, 4, 5]);

  const handleToggle = (enabled: boolean) => {
    setEnabled(enabled);
    if (enabled) {
      onChange({
        startTime,
        endTime,
        daysOfWeek: selectedDays
      });
    } else {
      onChange(undefined);
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (enabled) {
      onChange({
        startTime: time,
        endTime,
        daysOfWeek: selectedDays
      });
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (enabled) {
      onChange({
        startTime,
        endTime: time,
        daysOfWeek: selectedDays
      });
    }
  };

  const toggleDay = (day: number) => {
    let newDays;
    if (selectedDays.includes(day)) {
      newDays = selectedDays.filter(d => d !== day);
    } else {
      newDays = [...selectedDays, day].sort();
    }
    setSelectedDays(newDays);
    if (enabled) {
      onChange({
        startTime,
        endTime,
        daysOfWeek: newDays
      });
    }
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="sending-window-toggle" className="font-medium">
          Restrict sending hours
        </Label>
        <Switch 
          id="sending-window-toggle" 
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {enabled && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select 
                value={startTime} 
                onValueChange={handleStartTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>End Time</Label>
              <Select 
                value={endTime} 
                onValueChange={handleEndTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 mt-2">
              {days.map(day => (
                <div key={day.value} className="flex flex-col items-center space-y-1">
                  <Checkbox 
                    id={`day-${day.value}`} 
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                    className="mx-auto"
                  />
                  <Label 
                    htmlFor={`day-${day.value}`}
                    className="text-xs text-center cursor-pointer"
                  >
                    {day.label.substring(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {!enabled && (
        <p className="text-sm text-muted-foreground">
          Messages will be sent at any time without restrictions.
        </p>
      )}
    </div>
  );
};

export default TimeWindowSelector;
