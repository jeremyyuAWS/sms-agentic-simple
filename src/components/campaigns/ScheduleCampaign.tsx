
import React, { useState } from 'react';
import { Campaign, TimeWindow } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, Clock, Globe } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type TimeZoneOption = {
  value: string;
  label: string;
  offset: string;
};

interface ScheduleCampaignProps {
  campaign: Campaign;
  onScheduleUpdate: (
    scheduledStartDate: Date,
    timeZone?: string,
    sendingWindow?: TimeWindow
  ) => void;
  onClose?: () => void;
}

// Common time zones options
const timeZones: TimeZoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5/4' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6/5' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7/6' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8/7' },
  { value: 'America/Anchorage', label: 'Alaska Time', offset: 'UTC-9/8' },
  { value: 'America/Adak', label: 'Hawaii-Aleutian Time', offset: 'UTC-10/9' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0/+1' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1/+2' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 'UTC+10/+11' },
];

// Time slot options
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: format(new Date().setHours(hour, minute), 'h:mm a')
  };
});

const ScheduleCampaign: React.FC<ScheduleCampaignProps> = ({ 
  campaign, 
  onScheduleUpdate,
  onClose
}) => {
  // Set default date to today if not already set
  const [date, setDate] = useState<Date>(
    campaign.scheduledStartDate || addDays(new Date(), 1)
  );
  
  // Set defaults for time zone
  const [timeZone, setTimeZone] = useState<string>(
    campaign.timeZone || 'America/New_York'
  );
  
  // Set defaults for sending window
  const [useTimeWindow, setUseTimeWindow] = useState<boolean>(
    !!campaign.sendingWindow
  );
  const [startTime, setStartTime] = useState<string>(
    campaign.sendingWindow?.startTime || '09:00'
  );
  const [endTime, setEndTime] = useState<string>(
    campaign.sendingWindow?.endTime || '17:00'
  );
  
  // Weekdays selection
  const [selectedDays, setSelectedDays] = useState<number[]>(
    campaign.sendingWindow?.daysOfWeek || [1, 2, 3, 4, 5] // Mon-Fri by default
  );
  
  const weekdays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];
  
  const toggleDay = (day: number) => {
    setSelectedDays(current => 
      current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day].sort()
    );
  };
  
  const handleSaveSchedule = () => {
    let sendingWindow: TimeWindow | undefined;
    
    if (useTimeWindow) {
      sendingWindow = {
        startTime,
        endTime,
        daysOfWeek: selectedDays,
      };
    }
    
    onScheduleUpdate(date, timeZone, sendingWindow);
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Schedule Campaign
        </CardTitle>
        <CardDescription>
          Set when your campaign should start and during what hours messages should be sent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                initialFocus
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Select when the campaign should start sending messages
          </p>
        </div>

        {/* Time Zone Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Time Zone
          </Label>
          <Select 
            value={timeZone} 
            onValueChange={setTimeZone}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  <div className="flex justify-between items-center w-full">
                    <span>{tz.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">{tz.offset}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Messages will be sent according to recipients' local time in this zone
          </p>
        </div>

        {/* Sending Window */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Limit Sending Hours
            </Label>
            <Switch 
              checked={useTimeWindow}
              onCheckedChange={setUseTimeWindow}
            />
          </div>
          
          {useTimeWindow && (
            <div className="border rounded-md p-4 space-y-4 bg-muted/30">
              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select 
                    value={startTime} 
                    onValueChange={setStartTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem 
                          key={slot.value} 
                          value={slot.value}
                          disabled={slot.value >= endTime}
                        >
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select 
                    value={endTime} 
                    onValueChange={setEndTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem 
                          key={slot.value} 
                          value={slot.value}
                          disabled={slot.value <= startTime}
                        >
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Days of Week */}
              <div className="space-y-2">
                <Label>Send on these days</Label>
                <div className="grid grid-cols-7 gap-1">
                  {weekdays.map((day) => (
                    <div key={day.value} className="flex flex-col items-center">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={selectedDays.includes(day.value)}
                        onCheckedChange={() => toggleDay(day.value)}
                        className="mb-1"
                      />
                      <Label
                        htmlFor={`day-${day.value}`}
                        className="text-xs cursor-pointer"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Messages will only be sent during these hours on the selected days
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSaveSchedule} 
          className="w-full mt-4"
        >
          Save Schedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScheduleCampaign;
