
import React from 'react';
import { Button } from '@/components/ui/button';

interface CampaignCreatorFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const CampaignCreatorFooter: React.FC<CampaignCreatorFooterProps> = ({
  isSubmitting,
  onCancel,
  onSubmit,
  isEditing
}) => {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-primary"
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
      </Button>
    </div>
  );
};

export default CampaignCreatorFooter;
