
import React from 'react';
import ScheduleCampaign from '../ScheduleCampaign';
import { TimeWindow } from '@/lib/types';

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
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Campaign Schedule</h2>
      <ScheduleCampaign
        startDate={startDate}
        window={window}
        timezone={timezone}
        onScheduleChange={onScheduleChange}
        onSendingWindowChange={onSendingWindowChange}
        onTimeZoneChange={onTimeZoneChange}
      />
    </div>
  );
};

export default CampaignScheduleTab;
