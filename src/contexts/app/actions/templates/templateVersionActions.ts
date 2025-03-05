
import { Template, TemplateVersion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createTemplateVersionActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  const { toast } = useToast();

  // Version history storage
  const templateVersions: { [templateId: string]: TemplateVersion[] } = {};
  
  const createTemplateVersion = (templateId: string, version: Omit<TemplateVersion, 'id'> & { id: string }) => {
    if (!templateVersions[templateId]) {
      templateVersions[templateId] = [];
    }
    
    templateVersions[templateId].push(version as TemplateVersion);
    return version;
  };
  
  const getTemplateVersions = (templateId: string): TemplateVersion[] => {
    return templateVersions[templateId] || [];
  };
  
  const getTemplateVersion = (templateId: string, versionId: string): TemplateVersion | undefined => {
    return (templateVersions[templateId] || []).find(version => version.id === versionId);
  };
  
  const revertToVersion = (templateId: string, versionId: string) => {
    const version = getTemplateVersion(templateId, versionId);
    if (!version) {
      toast({
        title: "Error",
        description: "Template version not found",
        variant: "destructive"
      });
      return;
    }
    
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          name: version.name,
          body: version.body,
          variables: version.variables,
          currentVersionId: versionId,
          updatedAt: new Date()
        };
      }
      return template;
    }));
    
    toast({
      title: "Template Reverted",
      description: `Template has been reverted to version from ${new Date(version.createdAt).toLocaleString()}`
    });
  };
  
  return {
    createTemplateVersion,
    getTemplateVersions,
    getTemplateVersion,
    revertToVersion
  };
};
