
import React, { useState, useEffect } from 'react';
import { FollowUpCondition, Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import our components and hooks
import FollowUpItem from './follow-ups/FollowUpItem';
import SequenceSummary from './follow-ups/SequenceSummary';
import ApprovalSection from './follow-ups/ApprovalSection';
import { useFollowUpManagement } from './follow-ups/useFollowUpManagement';

interface CampaignFollowupsTabProps {
  isFollowUpsEnabled: boolean;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  followUps: any[];
  selectedTemplateId: string;
  templates: Template[];
  onFollowUpsChange: (followUps: any[]) => void;
  knowledgeBaseId?: string;
  knowledgeBases?: any[];
  onComplete?: () => void;
}

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  onFollowUpsChange,
  onComplete,
}) => {
  const { toast } = useToast();
  const [approved, setApproved] = useState(false);

  // Use our custom hooks
  const { updateFollowUp, getMessageTitle } = useFollowUpManagement(followUps, onFollowUpsChange);

  // Generate follow-ups if none exist
  useEffect(() => {
    if (followUps.length === 0) {
      // Create default follow-up sequence with selectedTemplateId
      const defaultFollowUps = [
        {
          id: `followup-${Date.now()}-1`,
          templateId: selectedTemplateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Follow-up Message',
          conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
        }
      ];
      
      onFollowUpsChange(defaultFollowUps);
    }
  }, [followUps.length, selectedTemplateId, onFollowUpsChange]);

  // Call onComplete when approved changes
  useEffect(() => {
    if (approved && onComplete) {
      onComplete();
    }
  }, [approved, onComplete]);

  const handleApproveSequence = () => {
    setApproved(true);
    toast({
      title: "Follow-up Sequence Approved",
      description: "Your message sequence has been approved. You can now complete the campaign setup.",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2 mt-2 mb-4">
        <p className="font-medium">Your Message Sequence</p>
        <p>Customize your message sequence by editing the content and timing of each message. Follow-up messages help increase engagement and response rates.</p>
      </div>

      {/* Visual Sequence Builder - Now the main and only view */}
      <div className="border rounded-lg p-4">
        <div className="space-y-6">
          {/* Pre-defined message sequence */}
          {followUps.map((followUp, index) => (
            <FollowUpItem
              key={followUp.id}
              followUp={followUp}
              index={index}
              totalCount={followUps.length}
              getMessageTitle={getMessageTitle}
              updateFollowUp={updateFollowUp}
            />
          ))}
          
          {/* Add follow-up button */}
          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed"
            onClick={() => {
              const newFollowUp = {
                id: `followup-${Date.now()}-${followUps.length + 1}`,
                templateId: selectedTemplateId,
                delayDays: followUps.length > 0 ? followUps[followUps.length - 1].delayDays + 4 : 3,
                enabled: true,
                name: `Follow-up Message ${followUps.length}`,
                conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
              };
              
              onFollowUpsChange([...followUps, newFollowUp]);
            }}
          >
            Add Follow-up Message
          </Button>
        </div>
      </div>

      {/* Sequence Overview */}
      <SequenceSummary 
        followUps={followUps}
        getMessageTitle={getMessageTitle}
      />

      {/* Approval and Completion Section */}
      <ApprovalSection 
        approved={approved}
        handleApproveSequence={handleApproveSequence}
      />
    </div>
  );
};

export default CampaignFollowupsTab;
