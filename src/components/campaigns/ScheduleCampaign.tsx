
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeWindow } from "@/lib/types";
import TimeZoneSelector from "./TimeZoneSelector";
import TimeWindowSelector from "./TimeWindowSelector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

interface ScheduleCampaignProps {
  startDate?: Date;
  window?: TimeWindow;
  timezone?: string;
  onScheduleChange: (date: Date) => void;
  onSendingWindowChange: (window: TimeWindow | undefined) => void;
  onTimeZoneChange: (timezone: string) => void;
}

const ScheduleCampaign: React.FC<ScheduleCampaignProps> = ({
  startDate = new Date(),
  window,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onScheduleChange,
  onSendingWindowChange,
  onTimeZoneChange,
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onScheduleChange(date);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Start Date</CardTitle>
          <CardDescription>
            Select when your campaign should start sending messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < tomorrow}
                className="rounded-md border"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Selected Start Date</h3>
                <p className="text-muted-foreground">
                  {startDate ? format(startDate, "EEEE, MMMM d, yyyy") : "No date selected"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your campaign will begin sending on this date according to the sending window and time zone settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Time Zone</h3>
                <TimeZoneSelector 
                  value={timezone} 
                  onChange={onTimeZoneChange} 
                />
                <p className="text-sm text-muted-foreground mt-1">
                  All scheduling will be based on this time zone
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sending Window</CardTitle>
          <CardDescription>
            Restrict when your messages will be delivered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeWindowSelector 
            value={window} 
            onChange={onSendingWindowChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleCampaign;
