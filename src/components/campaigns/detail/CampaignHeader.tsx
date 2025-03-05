
import React from 'react';
import { Campaign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Play, Pause } from 'lucide-react';
import StatusBadge from '../StatusBadge';

interface CampaignHeaderProps {
  campaign: Campaign;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
  onEdit: (campaignId: string, campaignType: string) => void;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaign,
  onStatusChange,
  onEdit,
}) => {
  const handleStatusToggle = () => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    onStatusChange(campaign.id, newStatus);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{campaign.name}</h2>
          <p className="text-muted-foreground">{campaign.description || 'No description provided'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={campaign.status} />
          
          {campaign.status !== 'completed' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleStatusToggle}
              >
                {campaign.status === 'active' ? (
                  <Pause className="h-4 w-4 mr-1" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                {campaign.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(campaign.id, "sales-outreach")}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
