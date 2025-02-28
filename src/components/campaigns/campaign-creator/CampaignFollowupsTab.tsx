
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template } from '@/lib/types';

interface CampaignFollowupsTabProps {
  isFollowUpsEnabled: boolean;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  followUps: any[];
  selectedTemplateId: string;
  templates: Template[];
  onFollowUpsChange: (followUps: any[]) => void;
}

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  templates,
  onFollowUpsChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <div>
          <Label htmlFor="followups-enabled" className="text-base font-medium">Enable Follow-ups</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Automatically send follow-up messages to contacts who haven't responded.
          </p>
        </div>
        <Switch
          id="followups-enabled"
          checked={isFollowUpsEnabled}
          onCheckedChange={setIsFollowUpsEnabled}
        />
      </div>
      
      {isFollowUpsEnabled && (
        <FollowUpFlowBuilder
          initialTemplateId={selectedTemplateId || templates[0]?.id || ""}
          followUps={followUps}
          templates={templates}
          onUpdate={onFollowUpsChange}
        />
      )}
    </div>
  );
};

export default CampaignFollowupsTab;
