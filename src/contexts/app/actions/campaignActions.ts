
import { Campaign, KnowledgeBase, FollowUp } from '@/lib/types';
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
      updatedAt: campaignData.updatedAt || now,
      followUps: campaignData.followUps || []
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
  
  const addFollowUpToCampaign = (campaignId: string, followUp: Omit<FollowUp, 'id'>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        // Create a new follow-up with ID
        const newFollowUp: FollowUp = {
          ...followUp,
          id: `followup-${Date.now()}`
        };
        
        // Add to campaign's follow-ups array or create a new array
        const campaign = updated[campaignIndex];
        const followUps = campaign.followUps || [];
        
        updated[campaignIndex] = {
          ...campaign,
          followUps: [...followUps, newFollowUp],
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Added",
      description: `Follow-up message has been added to the campaign.`
    });
  };
  
  const updateFollowUp = (campaignId: string, followUpId: string, updates: Partial<Omit<FollowUp, 'id'>>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.followUps) {
          const updatedFollowUps = campaign.followUps.map(fu => 
            fu.id === followUpId ? { ...fu, ...updates } : fu
          );
          
          updated[campaignIndex] = {
            ...campaign,
            followUps: updatedFollowUps,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Updated",
      description: `Follow-up message has been updated.`
    });
  };
  
  const removeFollowUp = (campaignId: string, followUpId: string) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.followUps) {
          const filteredFollowUps = campaign.followUps.filter(fu => fu.id !== followUpId);
          
          updated[campaignIndex] = {
            ...campaign,
            followUps: filteredFollowUps,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Removed",
      description: `Follow-up message has been removed from the campaign.`
    });
  };
  
  const updateCampaignSchedule = (campaignId: string, scheduledStartDate: Date) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          scheduledStartDate,
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Campaign Schedule Updated",
      description: `Campaign scheduled to start on ${scheduledStartDate.toLocaleString()}.`
    });
  };

  return {
    createCampaign,
    updateCampaignStatus,
    addFollowUpToCampaign,
    updateFollowUp,
    removeFollowUp,
    updateCampaignSchedule
  };
};
