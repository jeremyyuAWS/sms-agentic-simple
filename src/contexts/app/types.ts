
import { 
  Campaign, 
  Contact, 
  Conversation, 
  Template, 
  MetricItem,
  Message,
  KnowledgeBase,
  FollowUp,
  ContactFilter,
  ContactTag,
  ContactSegment
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
  contactTags: ContactTag[];
  contactSegments: ContactSegment[];
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
  setContactTags: React.Dispatch<React.SetStateAction<ContactTag[]>>;
  setContactSegments: React.Dispatch<React.SetStateAction<ContactSegment[]>>;
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
  addFollowUpToCampaign: (campaignId: string, followUp: Omit<FollowUp, 'id'>) => void;
  updateFollowUp: (campaignId: string, followUpId: string, updates: Partial<Omit<FollowUp, 'id'>>) => void;
  removeFollowUp: (campaignId: string, followUpId: string) => void;
  updateCampaignSchedule: (campaignId: string, scheduledStartDate: Date) => void;
  createTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createContactTag: (tag: Omit<ContactTag, 'id' | 'count'>) => void;
  assignTagToContacts: (tagId: string, contactIds: string[]) => void;
  removeTagFromContacts: (tagId: string, contactIds: string[]) => void;
  createContactSegment: (segment: Omit<ContactSegment, 'id' | 'count' | 'createdAt'>) => void;
  updateContactSegment: (id: string, updates: Partial<Omit<ContactSegment, 'id' | 'count' | 'createdAt'>>) => void;
  deleteContactSegment: (id: string) => void;
}
