
import { Template, TemplateCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createTemplateActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  const { toast } = useToast();

  const createTemplate = (templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTemplate: Template = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      categoryIds: templateData.categoryIds || []
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Created",
      description: `Template "${newTemplate.name}" has been created successfully.`
    });
    
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<Omit<Template, 'id' | 'createdAt'>>) => {
    const now = new Date();
    
    setTemplates(prev => prev.map(template => {
      if (template.id === id) {
        return {
          ...template,
          ...updates,
          updatedAt: now
        };
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
      
      const duplicatedTemplate: Template = {
        ...templateToDuplicate,
        id: `template-${Date.now()}`,
        name: `${templateToDuplicate.name} (Copy)`,
        createdAt: now,
        updatedAt: now
      };
      
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

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    createTemplateCategory,
    assignTemplateToCategory,
    removeTemplateFromCategory
  };
};
