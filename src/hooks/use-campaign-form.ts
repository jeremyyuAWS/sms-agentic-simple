
import { useState, useEffect } from 'react';
import { Campaign, TimeWindow, CampaignTemplate } from '@/lib/types';
import { useToast } from './use-toast';

export interface CampaignFormState {
  name: string;
  description: string;
  templateId: string;
  knowledgeBaseId: string;
  scheduledStartDate?: Date;
  timeZone: string;
  sendingWindow?: TimeWindow;
  contactIds: string[];
  contactListId?: string;
  segmentId?: string;
  followUps: any[];
  isFollowUpsEnabled: boolean;
}

interface UseCampaignFormOptions {
  initialCampaign?: Campaign;
  onSubmit: (
    campaignId: string | undefined, 
    formData: Partial<Omit<Campaign, 'id' | 'createdAt'>>
  ) => void;
}

export const useCampaignForm = ({ initialCampaign, onSubmit }: UseCampaignFormOptions) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  
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

  const handleTemplateSelect = (template: CampaignTemplate) => {
    handleInputChange('templateId', template.id);
  };

  const handleContactsSelect = (contacts: string[]) => {
    handleInputChange('contactIds', contacts);
  };

  const handleListSelect = (listId?: string) => {
    setFormState(prev => ({
      ...prev,
      contactListId: listId,
      segmentId: undefined,
      contactIds: [],
    }));
  };

  const handleSegmentSelect = (segmentId?: string) => {
    setFormState(prev => ({
      ...prev,
      segmentId,
      contactListId: undefined,
      contactIds: [],
    }));
  };

  const setIsFollowUpsEnabled = (enabled: boolean) => {
    handleInputChange('isFollowUpsEnabled', enabled);
  };

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

    // Validate template selection
    if (!formState.templateId) {
      toast({
        title: "Validation Error",
        description: "You must select a template",
        variant: "destructive",
      });
      setActiveTab('template');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data for submission
      const now = new Date();
      const campaignData = {
        name: formState.name,
        description: formState.description,
        templateId: formState.templateId,
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
      await onSubmit(initialCampaign?.id, campaignData);
      
      // Show success message
      toast({
        title: initialCampaign ? "Campaign Updated" : "Campaign Created",
        description: `Campaign "${formState.name}" has been ${initialCampaign ? 'updated' : 'created'} successfully.`,
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
