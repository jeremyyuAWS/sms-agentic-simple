
import React, { useState } from 'react';
import { Campaign, TimeWindow } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import TimeZoneSelector from './TimeZoneSelector';
import TimeWindowSelector from './TimeWindowSelector';

interface ScheduleCampaignProps {
  campaign: Campaign;
  onScheduleUpdate: (scheduledStartDate: Date, timeZone?: string, sendingWindow?: TimeWindow) => void;
  onClose: () => void;
}

const ScheduleCampaign: React.FC<ScheduleCampaignProps> = ({
  campaign,
  onScheduleUpdate,
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    campaign.scheduledStartDate ? new Date(campaign.scheduledStartDate) : undefined
  );
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
    campaign.timeZone || 'America/Los_Angeles'
  );
  const [sendingWindow, setSendingWindow] = useState<TimeWindow | undefined>(
    campaign.sendingWindow
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      return;
    }

    onScheduleUpdate(selectedDate, selectedTimeZone, sendingWindow);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Campaign</CardTitle>
          <CardDescription>
            Set when your campaign should start and define sending windows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="grid gap-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              {selectedDate && (
                <p className="text-sm text-muted-foreground">
                  Campaign will start on {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Zone</Label>
            <TimeZoneSelector
              value={selectedTimeZone}
              onChange={setSelectedTimeZone}
            />
            <p className="text-sm text-muted-foreground">
              All times will be relative to this time zone
            </p>
          </div>

          <div className="space-y-2">
            <Label>Sending Window</Label>
            <TimeWindowSelector
              value={sendingWindow}
              onChange={setSendingWindow}
            />
            <p className="text-sm text-muted-foreground">
              Messages will only be sent during these hours
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!selectedDate}
        >
          Schedule Campaign
        </Button>
      </div>
    </form>
  );
};

export default ScheduleCampaign;
