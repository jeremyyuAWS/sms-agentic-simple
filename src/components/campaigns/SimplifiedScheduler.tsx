
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimplifiedSchedulerProps {
  scheduledDate?: Date;
  timeWindow: { start: string; end: string };
  avoidWeekends: boolean;
  followUpDelay: number;
  onDateChange: (date: Date | undefined) => void;
  onTimeWindowChange: (window: { start: string; end: string }) => void;
  onAvoidWeekendsChange: (avoid: boolean) => void;
  onFollowUpDelayChange: (days: number) => void;
}

const SimplifiedScheduler: React.FC<SimplifiedSchedulerProps> = ({
  scheduledDate,
  timeWindow,
  avoidWeekends,
  followUpDelay,
  onDateChange,
  onTimeWindowChange,
  onAvoidWeekendsChange,
  onFollowUpDelayChange
}) => {
  // Function to disable past dates
  const isPastDate = (day: Date) => {
    return isBefore(day, startOfToday());
  };

  // Handle time window change
  const handleStartTimeChange = (value: string) => {
    onTimeWindowChange({ ...timeWindow, start: value });
  };

  const handleEndTimeChange = (value: string) => {
    onTimeWindowChange({ ...timeWindow, end: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Set Campaign Schedule</h2>
        <p className="text-muted-foreground mt-2">
          Choose when to start your campaign and set timing preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date Selection */}
        <Card>
          <CardContent className="pt-6">
            <Label className="mb-3 block">Campaign Start Date</Label>
            <div className="flex flex-col space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                  >
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Select date'}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={onDateChange}
                    disabled={isPastDate}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              
              {scheduledDate && (
                <p className="text-sm text-muted-foreground">
                  Your campaign will start on {format(scheduledDate, 'PPPP')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Time Window Selection */}
        <Card>
          <CardContent className="pt-6">
            <Label className="mb-3 block">Sending Time Window</Label>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Messages will only be sent during these hours
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-xs mb-1 block">Start Time</Label>
                <Select
                  value={timeWindow.start}
                  onValueChange={handleStartTimeChange}
                >
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={`start-${hour}`} value={`${hour}:00`}>
                        {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="endTime" className="text-xs mb-1 block">End Time</Label>
                <Select
                  value={timeWindow.end}
                  onValueChange={handleEndTimeChange}
                >
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={`end-${hour}`} value={`${hour}:00`}>
                        {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Preferences */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="avoidWeekends">Avoid Weekends</Label>
              <p className="text-sm text-muted-foreground">
                Don't send messages on Saturday and Sunday
              </p>
            </div>
            <Switch
              id="avoidWeekends"
              checked={avoidWeekends}
              onCheckedChange={onAvoidWeekendsChange}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="followUpDelay">Follow-Up Delay</Label>
              <span className="text-sm font-medium">
                {followUpDelay} {followUpDelay === 1 ? 'day' : 'days'}
              </span>
            </div>
            <Slider
              id="followUpDelay"
              min={1}
              max={7}
              step={1}
              value={[followUpDelay]}
              onValueChange={(value) => onFollowUpDelayChange(value[0])}
            />
            <p className="text-sm text-muted-foreground">
              Wait this many days before sending a follow-up message if no response is received.
            </p>
            {followUpDelay > 0 && scheduledDate && (
              <p className="text-sm">
                Follow-up will be sent around {format(addDays(scheduledDate, followUpDelay), 'PPP')} if needed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedScheduler;
