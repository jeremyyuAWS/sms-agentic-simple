
import { Template } from '@/lib/types';
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
      updatedAt: now
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

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
