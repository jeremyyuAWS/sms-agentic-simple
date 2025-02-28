
import React from 'react';

interface CampaignDetailsTabProps {
  knowledgeBaseId: string;
  knowledgeBases: any[];
  onKnowledgeBaseSelect: (value: string) => void;
}

const CampaignDetailsTab: React.FC<CampaignDetailsTabProps> = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Campaign Settings</h3>
        <p className="text-sm text-muted-foreground">
          Your campaign is pre-configured with optimal settings for your selected campaign type.
          These settings include sending windows, follow-up sequences, and message scheduling.
        </p>
      </div>
    </div>
  );
};

export default CampaignDetailsTab;
