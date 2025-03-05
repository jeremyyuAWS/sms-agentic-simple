
import React from 'react';

const CampaignTypeSelectorHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold">Choose Campaign Type</h2>
      <p className="text-muted-foreground mt-2">
        Select the type of campaign you want to create
      </p>
    </div>
  );
};

export default CampaignTypeSelectorHeader;
