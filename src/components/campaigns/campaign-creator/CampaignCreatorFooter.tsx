
import React from 'react';
import { Button } from '@/components/ui/button';

interface CampaignCreatorFooterProps {
  isEditing: boolean;
  isSubmitting?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const CampaignCreatorFooter: React.FC<CampaignCreatorFooterProps> = ({
  isEditing,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isEditing ? 'Update Campaign' : 'Create Campaign'}
      </Button>
    </div>
  );
};

export default CampaignCreatorFooter;
