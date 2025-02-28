
import React from 'react';

interface CampaignDetailsTabProps {
  knowledgeBaseId?: string;
  knowledgeBases?: any[];
  onKnowledgeBaseSelect?: (value: string) => void;
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
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-blue-700">SMS Best Practices</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
          <li>Keep messages concise: SMS messages should be brief and to the point</li>
          <li>Include a clear call-to-action in each message</li>
          <li>Personalize messages with recipient's name when possible</li>
          <li>Always identify yourself or your company in the first message</li>
          <li>Send during business hours to maximize response rates</li>
          <li>Follow up strategically - the sequence is pre-configured for optimal engagement</li>
        </ul>
      </div>
    </div>
  );
};

export default CampaignDetailsTab;
