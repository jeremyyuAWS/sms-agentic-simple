
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeWindow } from '@/lib/types';
import { format, isBefore, startOfToday } from 'date-fns';
import TimeWindowSelector from './TimeWindowSelector';
import TimeZoneSelector from './TimeZoneSelector';

interface ScheduleCampaignProps {
  startDate?: Date;
  window?: TimeWindow;
  timezone?: string;
  onScheduleChange: (date: Date) => void;
  onSendingWindowChange: (window: TimeWindow | undefined) => void;
  onTimeZoneChange: (zone: string) => void;
}

const ScheduleCampaign: React.FC<ScheduleCampaignProps> = ({
  startDate,
  window,
  timezone = 'America/Los_Angeles',
  onScheduleChange,
  onSendingWindowChange,
  onTimeZoneChange
}) => {
  const [date, setDate] = useState<Date | undefined>(startDate);
  const [timeWindow, setTimeWindow] = useState<TimeWindow | undefined>(window);
  const [timeZone, setTimeZone] = useState<string>(timezone);

  // Function to disable past dates
  const isPastDate = (day: Date) => {
    return isBefore(day, startOfToday());
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onScheduleChange(selectedDate);
    }
  };

  // Handle time window selection
  const handleTimeWindowChange = (selectedWindow: TimeWindow | undefined) => {
    setTimeWindow(selectedWindow);
    onSendingWindowChange(selectedWindow);
  };

  // Handle timezone selection
  const handleTimezoneChange = (selectedTimezone: string) => {
    setTimeZone(selectedTimezone);
    onTimeZoneChange(selectedTimezone);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Schedule Campaign</h2>
      <p className="text-muted-foreground">
        Choose when your campaign should start and during which hours messages should be sent.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Start Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Start Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={isPastDate}
                    fromDate={new Date()} // Also ensures the calendar doesn't allow navigating too far back
                  />
                </PopoverContent>
              </Popover>
              
              <div className="text-sm text-muted-foreground">
                {date 
                  ? `Your campaign will start on ${format(date, 'PPPP')}` 
                  : "Select a start date for your campaign"}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Time Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Sending Window
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimeWindowSelector
              value={timeWindow}
              onChange={handleTimeWindowChange}
            />
          </CardContent>
        </Card>
        
        {/* Time Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Time Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeZoneSelector
              value={timeZone}
              onChange={handleTimezoneChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCampaign;
