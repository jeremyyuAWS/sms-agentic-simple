
import { Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createTemplateSharingActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  const { toast } = useToast();

  const shareTemplate = (templateId: string, isPublic: boolean = false, userIds: string[] = []) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          isPublic,
          sharedWith: userIds,
          updatedAt: new Date()
        };
      }
      return template;
    }));
    
    toast({
      title: "Template Shared",
      description: isPublic 
        ? "Template is now publicly available" 
        : `Template has been shared with ${userIds.length} users`
    });
  };
  
  const unshareTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          isPublic: false,
          sharedWith: [],
          updatedAt: new Date()
        };
      }
      return template;
    }));
    
    toast({
      title: "Template Sharing Disabled",
      description: "Template is no longer shared with anyone"
    });
  };
  
  const copySharedTemplate = (templateId: string, userId: string) => {
    setTemplates(prev => {
      const templateToCopy = prev.find(template => template.id === templateId);
      if (!templateToCopy) return prev;
      
      const now = new Date();
      const newTemplateId = `template-${Date.now()}`;
      const newVersionId = `version-${Date.now()}`;
      
      const copiedTemplate: Template = {
        ...templateToCopy,
        id: newTemplateId,
        name: `${templateToCopy.name} (Shared)`,
        createdAt: now,
        updatedAt: now,
        isPublic: false,
        sharedWith: [],
        sharedById: userId,
        originalTemplateId: templateId,
        versionsCount: 1,
        currentVersionId: newVersionId,
        usageStats: {
          templateId: newTemplateId,
          usageCount: 0,
          campaignIds: []
        }
      };
      
      toast({
        title: "Template Copied",
        description: `Shared template "${templateToCopy.name}" has been copied to your templates`
      });
      
      return [...prev, copiedTemplate];
    });
  };
  
  return {
    shareTemplate,
    unshareTemplate,
    copySharedTemplate
  };
};
