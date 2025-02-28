
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

  return {
    createTemplate
  };
};
