
import React from 'react';
import { Button } from '@/components/ui/button';
import CampaignTypeSelector, { CampaignType } from '@/components/campaigns/CampaignTypeSelector';

interface TypeSelectionViewProps {
  selectedType: CampaignType | null;
  onTypeSelect: (type: CampaignType) => void;
  onCancel: () => void;
}

const TypeSelectionView: React.FC<TypeSelectionViewProps> = ({
  selectedType,
  onTypeSelect,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <CampaignTypeSelector
        selectedType={selectedType}
        onSelect={onTypeSelect}
      />
    </div>
  );
};

export default TypeSelectionView;
