
import React, { useState, useEffect } from 'react';
import { campaigns, contacts, conversations, templates, metrics } from '@/lib/mockData';
import { 
  Campaign, 
  Contact, 
  Conversation, 
  Template, 
  MetricItem,
  KnowledgeBase,
  ContactTag,
  ContactSegment,
  ContactList,
  TemplateCategory
} from '@/lib/types';
import { AppContext } from './AppContext';
import { createMessageActions } from './actions/messageActions';
import { createContactActions } from './actions/contactActions';
import { createKnowledgeBaseActions } from './actions/knowledgeBaseActions';
import { createCampaignActions } from './actions/campaignActions';
import { createTemplateActions } from './actions/templateActions';
import { createWorkflowActions } from './actions/workflowActions';
import { createUIStateActions } from './actions/uiStateActions';
import { createCategoryActions } from './actions/categoryActions';
import { createContactListActions } from './actions/contactListActions';
import { initialTemplateCategories, initialContactLists } from './initialData';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Main data state
  const [campaignsState, setCampaigns] = useState<Campaign[]>(campaigns);
  const [contactsState, setContacts] = useState<Contact[]>(contacts);
  const [conversationsState, setConversations] = useState<Conversation[]>(conversations);
  const [templatesState, setTemplates] = useState<Template[]>(templates.map(template => ({
    ...template,
    versionsCount: 1,
    currentVersionId: `version-initial-${template.id}`,
    usageStats: {
      templateId: template.id,
      usageCount: Math.floor(Math.random() * 10),
      campaignIds: [],
      responseRate: Math.random() * 0.5,
      positiveResponseRate: Math.random() * 0.3,
      negativeResponseRate: Math.random() * 0.2
    },
    isPublic: Math.random() > 0.5
  })));
  const [metricsState, setMetrics] = useState<MetricItem[]>(metrics);
  const [knowledgeBasesState, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [contactTagsState, setContactTags] = useState<ContactTag[]>([]);
  const [contactSegmentsState, setContactSegments] = useState<ContactSegment[]>([]);
  const [templateCategoriesState, setTemplateCategories] = useState<TemplateCategory[]>(initialTemplateCategories);
  const [contactListsState, setContactLists] = useState<ContactList[]>(initialContactLists);
  
  // Domain-specific action hooks
  const campaignActions = createCampaignActions(
    setCampaigns,
    setKnowledgeBases
  );
  
  // Create the workflow actions, passing in the createCampaign function from campaignActions
  const workflowActions = createWorkflowActions(campaignActions.createCampaign);
  
  // UI state actions
  const uiStateActions = createUIStateActions();
  
  // Message actions
  const messageActions = createMessageActions(
    contactsState,
    setConversations,
    uiStateActions.activeConversation,
    uiStateActions.setActiveConversation
  );
  
  // Contact actions
  const contactActions = createContactActions(
    setContacts,
    setContactTags,
    setContactSegments
  );
  
  // Knowledge base actions
  const knowledgeBaseActions = createKnowledgeBaseActions(
    setKnowledgeBases,
    setCampaigns
  );
  
  // Template actions
  const templateActions = createTemplateActions(setTemplates);
  
  // Category actions
  const categoryActions = createCategoryActions(
    setTemplateCategories,
    setTemplates
  );
  
  // Contact list actions
  const contactListActions = createContactListActions(setContactLists);

  // Initialize template versions
  const initializeTemplateVersions = () => {
    templatesState.forEach(template => {
      if (template.currentVersionId) {
        templateActions.createTemplateVersion(template.id, {
          id: template.currentVersionId,
          templateId: template.id,
          name: template.name,
          body: template.body,
          variables: template.variables,
          createdAt: template.createdAt,
          notes: "Initial version"
        });
      }
    });
  };
  
  // Call this once during initialization
  useEffect(() => {
    initializeTemplateVersions();
  }, []);

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
        contactLists: contactListsState,
        templateCategories: templateCategoriesState,
        
        // UI State
        ...uiStateActions,
        
        // Workflow state and actions
        ...workflowActions,
        
        // State setters
        setCampaigns,
        setContacts,
        setConversations,
        setTemplates,
        setMetrics,
        setKnowledgeBases,
        setContactTags,
        setContactSegments,
        setContactLists,
        setTemplateCategories,
        
        // Domain-specific actions
        ...messageActions,
        ...contactActions,
        ...knowledgeBaseActions,
        ...campaignActions,
        ...templateActions,
        ...categoryActions,
        ...contactListActions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
