
import { useState } from 'react';
import { Campaign } from '@/lib/types';
import { CampaignFormState } from './types';

export const useFormState = (initialCampaign?: Campaign) => {
  // Initialize state with provided campaign or defaults
  const [formState, setFormState] = useState<CampaignFormState>({
    name: initialCampaign?.name || '',
    description: initialCampaign?.description || '',
    templateId: initialCampaign?.templateId || '',
    knowledgeBaseId: initialCampaign?.knowledgeBaseId || '',
    scheduledStartDate: initialCampaign?.scheduledStartDate,
    timeZone: initialCampaign?.timeZone || '',
    sendingWindow: initialCampaign?.sendingWindow,
    contactIds: initialCampaign?.contactIds || [],
    contactListId: initialCampaign?.contactListId,
    segmentId: initialCampaign?.segmentId,
    followUps: initialCampaign?.followUps || [],
    isFollowUpsEnabled: initialCampaign?.followUps ? initialCampaign.followUps.length > 0 : false,
  });

  // Handler for updating form state
  const handleInputChange = (fieldName: keyof CampaignFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return {
    formState,
    handleInputChange
  };
};
