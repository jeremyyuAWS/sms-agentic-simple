
import { createTemplateBasicActions } from './templateBasicActions';
import { createTemplateVersionActions } from './templateVersionActions';
import { createTemplateSharingActions } from './templateSharingActions';
import { createTemplateUsageActions } from './templateUsageActions';
import { Template } from '@/lib/types';

export const createTemplateActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  // Create all sub-actions with the setTemplates function
  const basicActions = createTemplateBasicActions(setTemplates);
  const versionActions = createTemplateVersionActions(setTemplates);
  const sharingActions = createTemplateSharingActions(setTemplates);
  const usageActions = createTemplateUsageActions(setTemplates);

  // Return all actions as a single object
  return {
    // Basic template CRUD operations
    ...basicActions,
    // Version history management
    ...versionActions, 
    // Sharing functionality
    ...sharingActions,
    // Usage tracking
    ...usageActions
  };
};
