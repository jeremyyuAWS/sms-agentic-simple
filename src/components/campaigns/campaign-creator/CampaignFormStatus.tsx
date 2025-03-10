
import React from 'react';
import { StatusBadgeFilled } from '@/components/campaigns/StatusBadge';
import { Check } from 'lucide-react';

interface CampaignFormStatusProps {
  isComplete: boolean;
  fieldName: string;
  variant?: 'tab' | 'field';
}

const CampaignFormStatus: React.FC<CampaignFormStatusProps> = ({ 
  isComplete, 
  fieldName,
  variant = 'field'
}) => {
  if (variant === 'tab') {
    return isComplete ? (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
        <Check className="w-3 h-3 mr-1" />
        Complete
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
        Attention
      </span>
    );
  }
  
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
