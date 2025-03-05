
import React from 'react';
import { Campaign } from '@/lib/types';
import CampaignCard from './card/CampaignCard';

interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (campaignId: string, defaultTab?: string) => void;
  onUpdateStatus: (campaignId: string, status: Campaign['status']) => void;
  onEdit?: (campaignId: string, campaignType: string) => void;
  onDelete?: (campaignId: string) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ 
  campaigns, 
  onSelect, 
  onUpdateStatus,
  onEdit,
  onDelete
}) => {
  // If no campaigns, show a message
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No campaigns yet. Click "New Campaign" to get started.</p>
      </div>
    );
  }

  // Updated wrapper function to ensure both arguments are always passed
  const handleEdit = (campaignId: string) => {
    if (onEdit) {
      onEdit(campaignId, "sales-outreach");
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign, index) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          index={index}
          onSelect={onSelect}
          onUpdateStatus={onUpdateStatus}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CampaignList;
