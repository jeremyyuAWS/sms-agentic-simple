
import React, { useState, useEffect } from 'react';
import ScheduleCampaignCustom from '../ScheduleCampaignCustom';
import { TimeWindow } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface CampaignScheduleTabProps {
  startDate?: Date;
  window?: TimeWindow;
  timezone: string;
  onScheduleChange: (date: Date) => void;
  onSendingWindowChange: (window: TimeWindow | undefined) => void;
  onTimeZoneChange: (timezone: string) => void;
}

const CampaignScheduleTab: React.FC<CampaignScheduleTabProps> = ({
  startDate,
  window,
  timezone,
  onScheduleChange,
  onSendingWindowChange,
  onTimeZoneChange
}) => {
  // Default to incomplete unless we have both a startDate and a window selected
  const [isScheduleComplete, setIsScheduleComplete] = useState(false);
  
  // Effect to check completeness whenever dependencies change
  useEffect(() => {
    const hasStartDate = !!startDate;
    const hasWindow = !!window;
    setIsScheduleComplete(hasStartDate && hasWindow);
  }, [startDate, window]);

  // Handle schedule change
  const handleScheduleChange = (date: Date) => {
    onScheduleChange(date);
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Campaign Schedule</h2>
        <Badge 
          variant="outline" 
          className={isScheduleComplete 
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-yellow-100 text-yellow-800 border-yellow-200"}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {isScheduleComplete ? "Complete" : "Attention Required"}
        </Badge>
      </div>
      <ScheduleCampaignCustom
        startDate={startDate}
        window={window}
        timezone={timezone}
        onScheduleChange={handleScheduleChange}
        onSendingWindowChange={onSendingWindowChange}
        onTimeZoneChange={onTimeZoneChange}
        defaultMonth={new Date()} // Set default month to current month
      />
      
      {!isScheduleComplete && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
          <p className="font-medium">Please complete your schedule setup:</p>
          <ul className="list-disc pl-5 mt-1">
            {!startDate && <li>Select a start date for your campaign</li>}
            {!window && <li>Choose a sending window (days and times)</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CampaignScheduleTab;
