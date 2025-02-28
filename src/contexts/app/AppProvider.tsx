
import React, { useState } from 'react';
import { campaigns, contacts, conversations, templates, metrics } from '@/lib/mockData';
import { 
  Campaign, 
  Contact, 
  Conversation, 
  Template, 
  MetricItem,
  KnowledgeBase,
  ContactTag,
  ContactSegment
} from '@/lib/types';
import { AppContext } from './AppContext';
import { createMessageActions } from './actions/messageActions';
import { createContactActions } from './actions/contactActions';
import { createKnowledgeBaseActions } from './actions/knowledgeBaseActions';
import { createCampaignActions } from './actions/campaignActions';
import { createTemplateActions } from './actions/templateActions';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // State
  const [campaignsState, setCampaigns] = useState<Campaign[]>(campaigns);
  const [contactsState, setContacts] = useState<Contact[]>(contacts);
  const [conversationsState, setConversations] = useState<Conversation[]>(conversations);
  const [templatesState, setTemplates] = useState<Template[]>(templates);
  const [metricsState, setMetrics] = useState<MetricItem[]>(metrics);
  const [knowledgeBasesState, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [contactTagsState, setContactTags] = useState<ContactTag[]>([]);
  const [contactSegmentsState, setContactSegments] = useState<ContactSegment[]>([]);
  
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // UI Actions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Domain-specific actions
  const messageActions = createMessageActions(
    contactsState,
    setConversations,
    activeConversation,
    setActiveConversation
  );
  
  const contactActions = createContactActions(
    setContacts,
    setContactTags,
    setContactSegments
  );
  
  const knowledgeBaseActions = createKnowledgeBaseActions(
    setKnowledgeBases,
    setCampaigns
  );
  
  const campaignActions = createCampaignActions(
    setCampaigns,
    setKnowledgeBases
  );
  
  const templateActions = createTemplateActions(setTemplates);

  return (
    <AppContext.Provider 
      value={{
        // State
        campaigns: campaignsState,
        contacts: contactsState,
        conversations: conversationsState,
        templates: templatesState,
        metrics: metricsState,
        knowledgeBases: knowledgeBasesState,
        contactTags: contactTagsState,
        contactSegments: contactSegmentsState,
        activeCampaign,
        activeConversation,
        activeTemplate,
        sidebarOpen,
        
        // State setters
        toggleSidebar,
        setCampaigns,
        setContacts,
        setConversations,
        setTemplates,
        setMetrics,
        setKnowledgeBases,
        setContactTags,
        setContactSegments,
        setActiveCampaign,
        setActiveConversation,
        setActiveTemplate,
        
        // Actions
        ...messageActions,
        ...contactActions,
        ...knowledgeBaseActions,
        ...campaignActions,
        ...templateActions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
