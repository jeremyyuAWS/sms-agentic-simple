
import React from 'react';
import { Campaign, TimeWindow } from '@/lib/types';
import ScheduleCampaign from './ScheduleCampaign';

interface ScheduleCampaignWrapperProps {
  campaign: Campaign;
  onScheduleUpdate: (scheduledStartDate: Date, timeZone?: string, sendingWindow?: TimeWindow) => void;
  onClose: () => void;
}

// This is a wrapper component that adapts the campaign object to the props required by ScheduleCampaign
const ScheduleCampaignWrapper: React.FC<ScheduleCampaignWrapperProps> = ({
  campaign,
  onScheduleUpdate,
  onClose
}) => {
  // Handle the different update callbacks and combine them into the single onScheduleUpdate
  const handleScheduleChange = (date: Date) => {
    onScheduleUpdate(date, campaign.timeZone, campaign.sendingWindow);
  };

  const handleTimeZoneChange = (zone: string) => {
    onScheduleUpdate(
      campaign.scheduledStartDate || new Date(), 
      zone, 
      campaign.sendingWindow
    );
  };

  const handleSendingWindowChange = (window: TimeWindow | undefined) => {
    onScheduleUpdate(
      campaign.scheduledStartDate || new Date(), 
      campaign.timeZone, 
      window
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Schedule Campaign: {campaign.name}</h2>
        <button onClick={onClose} className="text-sm text-blue-500 hover:underline">
          Back to Campaign
        </button>
      </div>

      <ScheduleCampaign
        startDate={campaign.scheduledStartDate}
        window={campaign.sendingWindow}
        timezone={campaign.timeZone}
        onScheduleChange={handleScheduleChange}
        onSendingWindowChange={handleSendingWindowChange}
        onTimeZoneChange={handleTimeZoneChange}
      />
    </div>
  );
};

export default ScheduleCampaignWrapper;
