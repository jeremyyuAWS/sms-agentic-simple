
import { useState } from 'react';
import { useToast } from '../use-toast';
import { CampaignFormState, UseCampaignFormOptions } from './types';

export const useFormSubmit = (
  formState: CampaignFormState, 
  options: UseCampaignFormOptions,
  setActiveTab: (tab: string) => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit handler
  const handleSubmit = async () => {
    // Basic validation
    if (!formState.name) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required",
        variant: "destructive",
      });
      return;
    }

    // Validate that either contacts, contact list, or segment is selected
    const hasContacts = formState.contactIds.length > 0 || formState.contactListId || formState.segmentId;
    if (!hasContacts) {
      toast({
        title: "Validation Error",
        description: "You must select contacts, a contact list, or a segment",
        variant: "destructive",
      });
      setActiveTab('contacts');
      return;
    }

    // Validate template selection - The issue is here
    // We need to check followUps[0].templateId as well since that's where the template ID might be
    const hasTemplate = formState.templateId || 
      (formState.followUps && 
       formState.followUps.length > 0 && 
       formState.followUps[0].templateId);
       
    if (!hasTemplate) {
      toast({
        title: "Validation Error",
        description: "You must select a template",
        variant: "destructive",
      });
      setActiveTab('messaging');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data for submission
      const now = new Date();
      const campaignData = {
        name: formState.name,
        description: formState.description,
        templateId: formState.templateId || (formState.followUps && formState.followUps.length > 0 ? formState.followUps[0].templateId : ''),
        knowledgeBaseId: formState.knowledgeBaseId,
        scheduledStartDate: formState.scheduledStartDate,
        timeZone: formState.timeZone,
        sendingWindow: formState.sendingWindow,
        contactIds: formState.contactIds,
        contactListId: formState.contactListId,
        segmentId: formState.segmentId,
        followUps: formState.isFollowUpsEnabled ? formState.followUps : [],
        status: 'draft' as const,
        updatedAt: now,
        contactCount: formState.contactIds.length || 0
      };
      
      // Call the submit handler passed as a prop
      await options.onSubmit(options.initialCampaign?.id, campaignData);
      
      // Show success message
      toast({
        title: options.initialCampaign ? "Campaign Updated" : "Campaign Created",
        description: `Campaign "${formState.name}" has been ${options.initialCampaign ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
