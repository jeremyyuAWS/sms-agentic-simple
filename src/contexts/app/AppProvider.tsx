
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
  const [templateCategoriesState, setTemplateCategories] = useState<TemplateCategory[]>([
    {
      id: 'category-1',
      name: 'Outreach',
      color: 'blue',
      description: 'Templates for initial outreach to new contacts'
    },
    {
      id: 'category-2',
      name: 'Follow-up',
      color: 'green',
      description: 'Templates for following up with contacts who haven\'t responded'
    },
    {
      id: 'category-3',
      name: 'Nurture',
      color: 'purple',
      description: 'Templates for nurturing relationships with engaged contacts'
    }
  ]);
  const [contactListsState, setContactLists] = useState<ContactList[]>([
    {
      id: 'list-1',
      name: 'Conference Attendees',
      description: 'People who attended the 2023 Annual Tech Conference',
      contactIds: contacts.slice(0, 15).map(c => c.id),
      createdAt: new Date('2023-05-15'),
      source: 'csv'
    },
    {
      id: 'list-2',
      name: 'Newsletter Subscribers',
      description: 'Active subscribers to our monthly newsletter',
      contactIds: contacts.slice(15, 35).map(c => c.id),
      createdAt: new Date('2023-06-20'),
      source: 'import'
    },
    {
      id: 'list-3',
      name: 'Product Demo Requests',
      description: 'People who requested a product demo in the last 3 months',
      contactIds: contacts.slice(35, 50).map(c => c.id),
      createdAt: new Date('2023-08-05'),
      source: 'manual'
    }
  ]);
  
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

  // Template category actions
  const createTemplateCategory = (category: Omit<TemplateCategory, 'id'>) => {
    const newCategory = {
      ...category,
      id: `category-${Date.now()}`
    };
    setTemplateCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateTemplateCategory = (id: string, updates: Partial<Omit<TemplateCategory, 'id'>>) => {
    setTemplateCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteTemplateCategory = (id: string) => {
    // Remove the category from all templates first
    setTemplates(prev => prev.map(template => {
      if (template.categoryIds?.includes(id)) {
        return {
          ...template,
          categoryIds: template.categoryIds.filter(catId => catId !== id),
          updatedAt: new Date()
        };
      }
      return template;
    }));
    
    // Then remove the category itself
    setTemplateCategories(prev => prev.filter(category => category.id !== id));
  };

  // Contact list actions
  const createContactList = (list: Omit<ContactList, 'id' | 'createdAt'>) => {
    const newList: ContactList = {
      ...list,
      id: `list-${Date.now()}`,
      createdAt: new Date()
    };
    setContactLists(prev => [...prev, newList]);
  };

  const updateContactList = (id: string, updates: Partial<Omit<ContactList, 'id' | 'createdAt'>>) => {
    setContactLists(prev => prev.map(list => 
      list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list
    ));
  };

  const deleteContactList = (id: string) => {
    setContactLists(prev => prev.filter(list => list.id !== id));
  };

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
        setContactLists,
        setTemplateCategories,
        setActiveCampaign,
        setActiveConversation,
        setActiveTemplate,
        
        // Actions
        ...messageActions,
        ...contactActions,
        ...knowledgeBaseActions,
        ...campaignActions,
        ...templateActions,
        createTemplateCategory,
        updateTemplateCategory,
        deleteTemplateCategory,
        createContactList,
        updateContactList,
        deleteContactList
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
