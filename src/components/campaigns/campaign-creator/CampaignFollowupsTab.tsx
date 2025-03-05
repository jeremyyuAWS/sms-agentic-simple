
import React, { useState, useEffect } from 'react';
import { FollowUpCondition, Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Import our components and hooks
import FollowUpList from './follow-ups/components/FollowUpList';
import IntroductionSection from './follow-ups/components/IntroductionSection';
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
    if (followUps.length === 0 && selectedTemplateId) {
      // Create default follow-up sequence with selectedTemplateId
      const defaultFollowUps = [
        {
          id: `followup-${Date.now()}-1`,
          templateId: selectedTemplateId, // Use the selected template ID
          delayDays: 0, // Initial message has no delay
          enabled: true,
          condition: 'no-response',
          name: 'Initial Message',
          conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
        }
      ];
      
      onFollowUpsChange(defaultFollowUps);
    } else if (followUps.length > 0 && selectedTemplateId && !followUps[0].templateId) {
      // If follow-ups exist but first one has no templateId, update it
      const updatedFollowUps = [...followUps];
      updatedFollowUps[0] = {
        ...updatedFollowUps[0],
        templateId: selectedTemplateId
      };
      onFollowUpsChange(updatedFollowUps);
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

  const handleAddFollowUp = () => {
    const newFollowUp = {
      id: `followup-${Date.now()}-${followUps.length + 1}`,
      templateId: selectedTemplateId,
      delayDays: followUps.length > 0 ? followUps[followUps.length - 1].delayDays + 4 : 3,
      enabled: true,
      name: `Follow-up Message ${followUps.length}`,
      conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
    };
    
    onFollowUpsChange([...followUps, newFollowUp]);
  };

  return (
    <div className="space-y-4">
      <IntroductionSection />

      {/* Visual Sequence Builder - Now the main and only view */}
      <div className="border rounded-lg p-4">
        <FollowUpList
          followUps={followUps}
          selectedTemplateId={selectedTemplateId}
          getMessageTitle={getMessageTitle}
          updateFollowUp={updateFollowUp}
          onAddFollowUp={handleAddFollowUp}
        />
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
