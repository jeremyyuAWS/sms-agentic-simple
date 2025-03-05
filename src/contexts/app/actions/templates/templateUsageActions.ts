
import { Template, TemplateUsage } from '@/lib/types';

export const createTemplateUsageActions = (
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
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

  return {
    trackTemplateUsage,
    updateTemplateStats
  };
};
