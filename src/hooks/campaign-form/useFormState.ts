
import { useState, useEffect } from 'react';
import { Campaign } from '@/lib/types';
import { CampaignFormState } from './types';

export const useFormState = (initialCampaign?: Campaign) => {
  // Form state
  const [formState, setFormState] = useState<CampaignFormState>({
    name: '',
    description: '',
    templateId: '',
    knowledgeBaseId: '',
    scheduledStartDate: undefined,
    timeZone: 'America/Los_Angeles',
    sendingWindow: undefined,
    contactIds: [],
    contactListId: undefined,
    segmentId: undefined,
    followUps: [],
    isFollowUpsEnabled: false,
  });

  // Load initial data from campaign if provided
  useEffect(() => {
    if (initialCampaign) {
      setFormState({
        name: initialCampaign.name || '',
        description: initialCampaign.description || '',
        templateId: initialCampaign.templateId || '',
        knowledgeBaseId: initialCampaign.knowledgeBaseId || '',
        scheduledStartDate: initialCampaign.scheduledStartDate,
        timeZone: initialCampaign.timeZone || 'America/Los_Angeles',
        sendingWindow: initialCampaign.sendingWindow,
        contactIds: initialCampaign.contactIds || [],
        contactListId: initialCampaign.contactListId,
        segmentId: initialCampaign.segmentId,
        followUps: initialCampaign.followUps || [],
        isFollowUpsEnabled: Boolean(initialCampaign.followUps && initialCampaign.followUps.length > 0),
      });
    }
  }, [initialCampaign]);

  // Input handlers
  const handleInputChange = (fieldName: keyof CampaignFormState, value: any) => {
    setFormState(prev => ({ ...prev, [fieldName]: value }));
  };

  return {
    formState,
    setFormState,
    handleInputChange
  };
};
