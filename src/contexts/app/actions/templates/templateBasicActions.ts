
import { Template, TemplateCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createTemplateBasicActions = (
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

  // Reference to the template versions
  const templateVersions: Record<string, any> = {};

  // Function to create template version (needed by other functions)
  const createTemplateVersion = (templateId: string, version: Omit<any, 'id'> & { id: string }) => {
    if (!templateVersions[templateId]) {
      templateVersions[templateId] = [];
    }
    
    templateVersions[templateId].push(version);
    return version;
  };

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    createTemplateCategory,
    assignTemplateToCategory,
    removeTemplateFromCategory,
    // Expose createTemplateVersion for the version actions to use 
    createTemplateVersion
  };
};
