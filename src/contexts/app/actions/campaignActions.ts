
import { Campaign, KnowledgeBase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createCampaignActions = (
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>,
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>
) => {
  const { toast } = useToast();

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    const now = new Date();
    const newCampaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      createdAt: now,
      updatedAt: campaignData.updatedAt || now
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    
    // If the campaign has a knowledge base, update the knowledge base's campaigns array
    if (newCampaign.knowledgeBaseId) {
      setKnowledgeBases(prev => prev.map(kb => {
        if (kb.id === newCampaign.knowledgeBaseId) {
          return {
            ...kb,
            campaigns: [...kb.campaigns, newCampaign.id]
          };
        }
        return kb;
      }));
    }
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${newCampaign.name}" has been created successfully.`
    });
    
    return newCampaign;
  };
  
  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          status,
          updatedAt: now,
          ...(status === 'active' && { startedAt: now }),
          ...(status === 'completed' && { completedAt: now })
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Campaign Updated",
      description: `Campaign status has been updated to ${status}.`
    });
  };

  return {
    createCampaign,
    updateCampaignStatus
  };
};
