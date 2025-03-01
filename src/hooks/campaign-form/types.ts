
import { Campaign, TimeWindow } from '@/lib/types';

// Define the CampaignTemplate interface that was previously inline
export interface CampaignTemplate {
  id: string;
  name: string;
  body: string;
}

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

export interface UseCampaignFormOptions {
  initialCampaign?: Campaign;
  onSubmit: (
    campaignId: string | undefined, 
    formData: Partial<Omit<Campaign, 'id' | 'createdAt'>>
  ) => void;
}

export interface UseCampaignFormReturn {
  formState: CampaignFormState;
  activeTab: string;
  isSubmitting: boolean;
  setActiveTab: (tab: string) => void;
  handleInputChange: (fieldName: keyof CampaignFormState, value: any) => void;
  handleTemplateSelect: (template: CampaignTemplate) => void;
  handleContactsSelect: (contacts: string[]) => void;
  handleListSelect: (listId?: string) => void;
  handleSegmentSelect: (segmentId?: string) => void;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  handleSubmit: () => Promise<void>;
}
