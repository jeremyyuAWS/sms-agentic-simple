
import React from 'react';
import CampaignTypeCard from './CampaignTypeCard';
import CampaignTypeSelectorHeader from './CampaignTypeSelectorHeader';
import { CampaignType, campaignTypes } from './types/campaignTypes';

interface CampaignTypeSelectorProps {
  selectedType: CampaignType | null;
  onSelect: (type: CampaignType) => void;
}

const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  return (
    <div className="space-y-6">
      <CampaignTypeSelectorHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignTypes.map((typeInfo) => (
          <CampaignTypeCard 
            key={typeInfo.id}
            typeInfo={typeInfo}
            isSelected={selectedType === typeInfo.id}
            onSelect={() => onSelect(typeInfo.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignTypeSelector;

// Also export the CampaignType type for backward compatibility
export type { CampaignType } from './types/campaignTypes';
