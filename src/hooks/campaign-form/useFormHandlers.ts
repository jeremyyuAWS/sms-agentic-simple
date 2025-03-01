
import { CampaignFormState, CampaignTemplate } from './types';

export const useFormHandlers = (formState: CampaignFormState, handleInputChange: (fieldName: keyof CampaignFormState, value: any) => void) => {
  const handleTemplateSelect = (template: CampaignTemplate) => {
    handleInputChange('templateId', template.id);
  };

  const handleContactsSelect = (contacts: string[]) => {
    handleInputChange('contactIds', contacts);
  };

  const handleListSelect = (listId?: string) => {
    // Deselect other options when list is selected
    handleInputChange('contactListId', listId);
    handleInputChange('segmentId', undefined);
    handleInputChange('contactIds', []);
  };

  const handleSegmentSelect = (segmentId?: string) => {
    // Deselect other options when segment is selected
    handleInputChange('segmentId', segmentId);
    handleInputChange('contactListId', undefined);
    handleInputChange('contactIds', []);
  };

  const setIsFollowUpsEnabled = (enabled: boolean) => {
    handleInputChange('isFollowUpsEnabled', enabled);
  };

  return {
    handleTemplateSelect,
    handleContactsSelect,
    handleListSelect,
    handleSegmentSelect,
    setIsFollowUpsEnabled
  };
};
