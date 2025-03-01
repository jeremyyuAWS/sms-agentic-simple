
import { useState } from 'react';
import { useFormState } from './useFormState';
import { useFormHandlers } from './useFormHandlers';
import { useFormSubmit } from './useFormSubmit';
import { UseCampaignFormOptions, UseCampaignFormReturn } from './types';

export const useCampaignForm = (options: UseCampaignFormOptions): UseCampaignFormReturn => {
  const [activeTab, setActiveTab] = useState<string>('details');
  
  const { formState, handleInputChange } = useFormState(options.initialCampaign);
  
  const {
    handleTemplateSelect,
    handleContactsSelect,
    handleListSelect,
    handleSegmentSelect,
    setIsFollowUpsEnabled
  } = useFormHandlers(formState, handleInputChange);
  
  const { isSubmitting, handleSubmit } = useFormSubmit(formState, options, setActiveTab);

  return {
    formState,
    activeTab,
    isSubmitting,
    setActiveTab,
    handleInputChange,
    handleTemplateSelect,
    handleContactsSelect,
    handleListSelect,
    handleSegmentSelect,
    setIsFollowUpsEnabled,
    handleSubmit,
  };
};

// Re-export types for external usage
export * from './types';
