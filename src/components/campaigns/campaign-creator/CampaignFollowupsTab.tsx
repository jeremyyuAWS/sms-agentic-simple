
import React, { useState, useEffect } from 'react';
import { FollowUpCondition } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Import our components and hooks
import FollowUpList from './follow-ups/components/FollowUpList';
import IntroductionSection from './follow-ups/components/IntroductionSection';
import SequenceSummary from './follow-ups/SequenceSummary';
import ApprovalSection from './follow-ups/ApprovalSection';
import { useFollowUpManagement } from './follow-ups/useFollowUpManagement';
import { useFollowUpConfiguration } from '@/hooks/campaign-type/useFollowUpConfiguration';
import AISequenceSuggestions from './follow-ups/components/AISequenceSuggestions';
import MessageSequenceBuilder from './follow-ups/components/MessageSequenceBuilder';

interface CampaignFollowupsTabProps {
  isFollowUpsEnabled: boolean;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  followUps: any[];
  selectedTemplateId: string;
  templates: any[];
  onFollowUpsChange: (followUps: any[]) => void;
  knowledgeBaseId?: string;
  knowledgeBases?: any[];
  onComplete?: () => void;
  campaignType?: string;
}

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  onFollowUpsChange,
  onComplete,
  campaignType = 'event-invitation'
}) => {
  const { toast } = useToast();
  const [approved, setApproved] = useState(false);
  const { getDefaultFollowUps } = useFollowUpConfiguration();

  // Use our custom hooks
  const { updateFollowUp, getMessageTitle } = useFollowUpManagement(followUps, onFollowUpsChange);

  // Generate follow-ups if none exist
  useEffect(() => {
    if (followUps.length === 0 && selectedTemplateId) {
      // Create a default initial message (always required)
      const initialMessage = {
        id: `followup-${Date.now()}-1`,
        templateId: selectedTemplateId,
        delayDays: 0, // Initial message has no delay
        enabled: true,
        condition: 'no-response',
        name: 'Initial Message',
        conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
      };
      
      // If campaign type is provided, get recommended sequence
      if (campaignType && campaignType !== 'event-invitation') {
        // Get default follow-ups for this campaign type
        const defaultSequence = getDefaultFollowUps(campaignType as any, selectedTemplateId);
        if (defaultSequence.length > 0) {
          onFollowUpsChange([initialMessage, ...defaultSequence.slice(1)]);
          return;
        }
      }
      
      // Fallback to just the initial message
      onFollowUpsChange([initialMessage]);
    }
  }, [followUps.length, selectedTemplateId, campaignType, onFollowUpsChange, getDefaultFollowUps]);

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
      templateId: selectedTemplateId || '', 
      delayDays: followUps.length > 0 ? 3 : 0, // Default to 3 days for follow-ups
      enabled: true,
      name: `Follow-up #${followUps.length}`,
      conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
    };
    
    onFollowUpsChange([...followUps, newFollowUp]);
  };

  const handleApplyAISequence = (messages: any[]) => {
    // Create new follow-ups with the AI-suggested messages
    const newFollowUps = messages.map((msg, index) => ({
      id: `followup-${Date.now()}-${index + 1}`,
      templateId: selectedTemplateId || '',
      delayDays: msg.delayDays || 0,
      enabled: true,
      name: msg.name,
      message: msg.message,
      conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
    }));
    
    onFollowUpsChange(newFollowUps);
  };

  return (
    <div className="space-y-4">
      <IntroductionSection />

      {/* AI Sequence Recommendations */}
      <AISequenceSuggestions 
        campaignType={campaignType}
        onApplySuggestion={handleApplyAISequence}
      />

      {/* Message Sequence Builder */}
      <MessageSequenceBuilder
        followUps={followUps}
        selectedTemplateId={selectedTemplateId}
        getMessageTitle={getMessageTitle}
        updateFollowUp={updateFollowUp}
        onAddFollowUp={handleAddFollowUp}
        campaignType={campaignType}
      />

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
