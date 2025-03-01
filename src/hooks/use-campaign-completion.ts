
import { useState, useEffect } from 'react';
import { CampaignFormState } from './use-campaign-form';

interface UseCampaignCompletionReturn {
  completedSections: string[];
  sectionApproved: {[key: string]: boolean};
  handleSectionApproval: (section: string, isApproved: boolean) => void;
}

export const useCampaignCompletion = (formState: CampaignFormState): UseCampaignCompletionReturn => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [sectionApproved, setSectionApproved] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    const completed: string[] = [];
    
    if (formState.name && formState.description) {
      completed.push('details');
    }
    
    if ((formState.contactIds && formState.contactIds.length > 0) || 
        formState.contactListId || 
        formState.segmentId) {
      completed.push('contacts');
    }
    
    if (formState.templateId) {
      completed.push('template');
    }
    
    if (formState.scheduledStartDate) {
      completed.push('schedule');
    }
    
    if (formState.isFollowUpsEnabled && formState.followUps.length > 0) {
      completed.push('followups');
    }
    
    setCompletedSections(completed);
  }, [formState]);

  const handleSectionApproval = (section: string, isApproved: boolean) => {
    setSectionApproved(prev => ({...prev, [section]: isApproved}));
  };

  return {
    completedSections,
    sectionApproved,
    handleSectionApproval
  };
};
