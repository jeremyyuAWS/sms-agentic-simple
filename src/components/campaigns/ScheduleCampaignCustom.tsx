
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { TimeWindow } from '@/lib/types';
import TimeZoneSelector from './TimeZoneSelector';
import TimeWindowSelector from './TimeWindowSelector';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduleCampaignProps {
  startDate?: Date;
  window?: TimeWindow;
  timezone: string;
  onScheduleChange: (date: Date) => void;
  onSendingWindowChange: (window: TimeWindow | undefined) => void;
  onTimeZoneChange: (timezone: string) => void;
  defaultMonth?: Date;
}

const ScheduleCampaignCustom: React.FC<ScheduleCampaignProps> = ({
  startDate,
  window,
  timezone,
  onScheduleChange,
  onSendingWindowChange,
  onTimeZoneChange,
  defaultMonth
}) => {
  // Set default date to tomorrow if not provided
  const tomorrow = addDays(new Date(), 1);
  tomorrow.setHours(9, 0, 0, 0); // Set to 9:00 AM

  // Set state for the selected date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startDate || tomorrow);
  const [calendarDefaultMonth, setCalendarDefaultMonth] = useState<Date>(defaultMonth || tomorrow);

  // Effect to make sure we set a default date when component mounts
  useEffect(() => {
    if (!startDate && !selectedDate) {
      setSelectedDate(tomorrow);
      onScheduleChange(tomorrow);
    }
  }, [startDate, selectedDate, onScheduleChange]);

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onScheduleChange(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Select Start Date</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose when your campaign will begin sending messages.
                </p>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                defaultMonth={calendarDefaultMonth}
                className="rounded-md border"
                disabled={(date) => date < tomorrow}
              />
              {selectedDate && (
                <div className="mt-2 text-sm font-medium text-center">
                  Campaign will start on: {format(selectedDate, 'PPP')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">Time Zone</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the time zone for your campaign.
                  </p>
                </div>
                <TimeZoneSelector value={timezone} onChange={onTimeZoneChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">Sending Window</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optionally define hours when messages can be sent.
                  </p>
                </div>
                <TimeWindowSelector value={window} onChange={onSendingWindowChange} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCampaignCustom;
