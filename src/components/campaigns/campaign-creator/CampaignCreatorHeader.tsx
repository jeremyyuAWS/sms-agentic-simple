
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CampaignCreatorHeaderProps {
  isEditing: boolean;
}

const CampaignCreatorHeader: React.FC<CampaignCreatorHeaderProps> = ({ isEditing }) => {
  return (
    <CardHeader>
      <CardTitle>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</CardTitle>
      <CardDescription>
        {isEditing 
          ? 'Update your campaign details here' 
          : 'Define the details for your new campaign'}
      </CardDescription>
    </CardHeader>
  );
};

export default CampaignCreatorHeader;
