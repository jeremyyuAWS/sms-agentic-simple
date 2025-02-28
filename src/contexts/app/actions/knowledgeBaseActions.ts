
import { Campaign, KnowledgeBase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createKnowledgeBaseActions = (
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>,
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>
) => {
  const { toast } = useToast();

  const uploadKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
    setKnowledgeBases(prev => [...prev, knowledgeBase]);
    
    toast({
      title: "Knowledge Base Uploaded",
      description: `"${knowledgeBase.fileName}" has been uploaded successfully.`
    });
  };
  
  const deleteKnowledgeBase = (id: string) => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
    
    // Also remove references from campaigns
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.knowledgeBaseId === id) {
        const { knowledgeBaseId, ...rest } = campaign;
        return rest;
      }
      return campaign;
    }));
  };

  return {
    uploadKnowledgeBase,
    deleteKnowledgeBase
  };
};
