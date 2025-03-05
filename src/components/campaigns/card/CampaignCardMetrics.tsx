
import React from 'react';
import { Campaign } from '@/lib/types';
import { Calendar, Users, Clock, BarChart3 } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface CampaignCardMetricsProps {
  campaign: Campaign;
}

const CampaignCardMetrics: React.FC<CampaignCardMetricsProps> = ({ campaign }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Created {formatDistance(new Date(campaign.createdAt), new Date(), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{campaign.contactCount || 0} contacts</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {campaign.sendingWindow?.startTime || "N/A"} - {campaign.sendingWindow?.endTime || "N/A"}
          </span>
        </div>
      </div>

      {campaign.responseRate && (
        <div className="mt-4 flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {(campaign.responseRate * 100).toFixed(1)}% response rate
          </span>
        </div>
      )}
    </>
  );
};

export default CampaignCardMetrics;
