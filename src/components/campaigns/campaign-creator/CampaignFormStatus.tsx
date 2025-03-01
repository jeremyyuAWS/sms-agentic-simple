
import React from 'react';
import { StatusBadgeFilled } from '@/components/campaigns/StatusBadge';

interface CampaignFormStatusProps {
  isComplete: boolean;
  fieldName: string;
}

const CampaignFormStatus: React.FC<CampaignFormStatusProps> = ({ isComplete, fieldName }) => {
  return (
    <div className="flex items-center space-x-2">
      {isComplete ? (
        <StatusBadgeFilled status="completed" />
      ) : (
        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
          Attention
        </span>
      )}
      <span className="text-sm text-muted-foreground">{fieldName}</span>
    </div>
  );
};

export default CampaignFormStatus;
