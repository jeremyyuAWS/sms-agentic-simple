
import { Template, TemplateCategory, TemplateVersion, TemplateUsage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createTemplateActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  const { toast } = useToast();

  const createTemplate = (templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const templateId = `template-${Date.now()}`;
    const versionId = `version-${Date.now()}`;
    
    const newTemplate: Template = {
      ...templateData,
      id: templateId,
      createdAt: now,
      updatedAt: now,
      categoryIds: templateData.categoryIds || [],
      versionsCount: 1,
      currentVersionId: versionId,
      usageStats: {
        templateId,
        usageCount: 0,
        campaignIds: []
      }
    };
    
    // Create initial version
    createTemplateVersion(templateId, {
      id: versionId,
      templateId,
      name: templateData.name,
      body: templateData.body,
      variables: templateData.variables,
      createdAt: now,
      notes: "Initial version"
    });
    
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Created",
      description: `Template "${newTemplate.name}" has been created successfully.`
    });
    
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<Omit<Template, 'id' | 'createdAt'>>) => {
    const now = new Date();
    const versionId = `version-${Date.now()}`;
    
    setTemplates(prev => prev.map(template => {
      if (template.id === id) {
        // Create a new version first (before updating the template)
        if (updates.body || updates.name || updates.variables) {
          createTemplateVersion(id, {
            id: versionId,
            templateId: id,
            name: updates.name || template.name,
            body: updates.body || template.body,
            variables: updates.variables || template.variables,
            createdAt: now,
            notes: "Updated template"
          });
          
          return {
            ...template,
            ...updates,
            updatedAt: now,
            versionsCount: (template.versionsCount || 0) + 1,
            currentVersionId: versionId
          };
        } else {
          // If we're just updating metadata (not content), don't create a new version
          return {
            ...template,
            ...updates,
            updatedAt: now
          };
        }
      }
      return template;
    }));
    
    toast({
      title: "Template Updated",
      description: "Template has been updated successfully."
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    
    toast({
      title: "Template Deleted",
      description: "Template has been deleted successfully."
    });
  };

  const duplicateTemplate = (id: string) => {
    const now = new Date();
    
    setTemplates(prev => {
      const templateToDuplicate = prev.find(template => template.id === id);
      if (!templateToDuplicate) return prev;
      
      const newTemplateId = `template-${Date.now()}`;
      const newVersionId = `version-${Date.now()}`;
      
      const duplicatedTemplate: Template = {
        ...templateToDuplicate,
        id: newTemplateId,
        name: `${templateToDuplicate.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
        versionsCount: 1,
        currentVersionId: newVersionId,
        usageStats: {
          templateId: newTemplateId,
          usageCount: 0,
          campaignIds: []
        }
      };
      
      // Create initial version for the duplicated template
      createTemplateVersion(newTemplateId, {
        id: newVersionId,
        templateId: newTemplateId,
        name: duplicatedTemplate.name,
        body: duplicatedTemplate.body,
        variables: duplicatedTemplate.variables,
        createdAt: now,
        notes: `Duplicated from "${templateToDuplicate.name}"`
      });
      
      toast({
        title: "Template Duplicated",
        description: `Template "${templateToDuplicate.name}" has been duplicated successfully.`
      });
      
      return [...prev, duplicatedTemplate];
    });
  };

  // Version history management
  
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
    
    updateTemplate(templateId, {
      name: version.name,
      body: version.body,
      variables: version.variables,
      currentVersionId: versionId
    });
    
    toast({
      title: "Template Reverted",
      description: `Template has been reverted to version from ${new Date(version.createdAt).toLocaleString()}`
    });
  };
  
  // Template sharing
  
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
      
      // Create initial version for the copied template
      createTemplateVersion(newTemplateId, {
        id: newVersionId,
        templateId: newTemplateId,
        name: copiedTemplate.name,
        body: copiedTemplate.body,
        variables: copiedTemplate.variables,
        createdAt: now,
        notes: `Copied from shared template "${templateToCopy.name}"`
      });
      
      toast({
        title: "Template Copied",
        description: `Shared template "${templateToCopy.name}" has been copied to your templates`
      });
      
      return [...prev, copiedTemplate];
    });
  };
  
  // Usage tracking
  
  const trackTemplateUsage = (templateId: string, campaignId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        const usageStats = template.usageStats || {
          templateId,
          usageCount: 0,
          campaignIds: []
        };
        
        const updatedStats: TemplateUsage = {
          ...usageStats,
          usageCount: usageStats.usageCount + 1,
          lastUsed: new Date(),
          campaignIds: [...new Set([...usageStats.campaignIds, campaignId])]
        };
        
        return {
          ...template,
          usageStats: updatedStats
        };
      }
      return template;
    }));
  };
  
  const updateTemplateStats = (templateId: string, responseRate?: number, positiveRate?: number, negativeRate?: number) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        const usageStats = template.usageStats || {
          templateId,
          usageCount: 0,
          campaignIds: []
        };
        
        return {
          ...template,
          usageStats: {
            ...usageStats,
            responseRate: responseRate !== undefined ? responseRate : usageStats.responseRate,
            positiveResponseRate: positiveRate !== undefined ? positiveRate : usageStats.positiveResponseRate,
            negativeResponseRate: negativeRate !== undefined ? negativeRate : usageStats.negativeResponseRate
          }
        };
      }
      return template;
    }));
  };

  const createTemplateCategory = (category: Omit<TemplateCategory, 'id'>) => {
    return {
      ...category,
      id: `category-${Date.now()}`
    };
  };

  const assignTemplateToCategory = (templateId: string, categoryId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        const categoryIds = template.categoryIds || [];
        if (!categoryIds.includes(categoryId)) {
          return {
            ...template,
            categoryIds: [...categoryIds, categoryId],
            updatedAt: new Date()
          };
        }
      }
      return template;
    }));
  };

  const removeTemplateFromCategory = (templateId: string, categoryId: string) => {
    setTemplates(prev => prev.map(template => {
      if (template.id === templateId && template.categoryIds) {
        return {
          ...template,
          categoryIds: template.categoryIds.filter(id => id !== categoryId),
          updatedAt: new Date()
        };
      }
      return template;
    }));
  };

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    createTemplateCategory,
    assignTemplateToCategory,
    removeTemplateFromCategory,
    // Version history
    createTemplateVersion,
    getTemplateVersions,
    getTemplateVersion,
    revertToVersion,
    // Sharing
    shareTemplate,
    unshareTemplate,
    copySharedTemplate,
    // Usage tracking
    trackTemplateUsage,
    updateTemplateStats
  };
};
