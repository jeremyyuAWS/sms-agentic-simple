
import { 
  Campaign, 
  Contact, 
  Conversation, 
  Template, 
  MetricItem,
  Message,
  KnowledgeBase
} from '@/lib/types';
import React from 'react';

export interface AppContextProps {
  // State
  campaigns: Campaign[];
  contacts: Contact[];
  conversations: Conversation[];
  templates: Template[];
  metrics: MetricItem[];
  knowledgeBases: KnowledgeBase[];
  activeCampaign: Campaign | null;
  activeConversation: Conversation | null;
  activeTemplate: Template | null;
  sidebarOpen: boolean;
  
  // State setters
  toggleSidebar: () => void;
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setMetrics: React.Dispatch<React.SetStateAction<MetricItem[]>>;
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>;
  setActiveCampaign: (campaign: Campaign | null) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setActiveTemplate: (template: Template | null) => void;
  
  // Actions
  sendMessage: (contactId: string, message: string, campaignId?: string) => void;
  uploadContacts: (contacts: Contact[]) => void;
  uploadKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  deleteKnowledgeBase: (id: string) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;
  createTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
}
