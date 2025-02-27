
import React, { createContext, useContext, useState } from 'react';
import { campaigns, contacts, conversations, templates, metrics } from '@/lib/mockData';
import { 
  Campaign, 
  Contact, 
  Conversation, 
  Template, 
  MetricItem,
  Message
} from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextProps {
  campaigns: Campaign[];
  contacts: Contact[];
  conversations: Conversation[];
  templates: Template[];
  metrics: MetricItem[];
  activeCampaign: Campaign | null;
  activeConversation: Conversation | null;
  activeTemplate: Template | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setMetrics: React.Dispatch<React.SetStateAction<MetricItem[]>>;
  setActiveCampaign: (campaign: Campaign | null) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setActiveTemplate: (template: Template | null) => void;
  sendMessage: (contactId: string, message: string, campaignId?: string) => void;
  uploadContacts: (contacts: Contact[]) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaignStatus: (campaignId: string, status: Campaign['status']) => void;
  createTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [campaignsState, setCampaigns] = useState<Campaign[]>(campaigns);
  const [contactsState, setContacts] = useState<Contact[]>(contacts);
  const [conversationsState, setConversations] = useState<Conversation[]>(conversations);
  const [templatesState, setTemplates] = useState<Template[]>(templates);
  const [metricsState, setMetrics] = useState<MetricItem[]>(metrics);
  
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sendMessage = (contactId: string, messageBody: string, campaignId?: string) => {
    // Generate unique message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create new message
    const newMessage: Message = {
      id: messageId,
      contactId,
      campaignId: campaignId || '1', // Default to first campaign if not specified
      body: messageBody,
      sentAt: new Date(),
      status: 'sent',
      type: 'outbound'
    };
    
    // Update conversations
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(c => c.contactId === contactId);
      
      if (conversationIndex !== -1) {
        // Update existing conversation
        updated[conversationIndex] = {
          ...updated[conversationIndex],
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.body,
          messages: [...updated[conversationIndex].messages, newMessage]
        };
      } else {
        // Create new conversation
        const contact = contactsState.find(c => c.id === contactId);
        if (contact) {
          updated.push({
            id: `conv-${Date.now()}`,
            contactId,
            contactName: contact.name,
            contactPhone: contact.phoneNumber,
            lastMessageAt: newMessage.sentAt,
            lastMessagePreview: newMessage.body,
            status: 'new',
            unreadCount: 0,
            messages: [newMessage]
          });
        }
      }
      
      return updated;
    });
    
    // Update active conversation if needed
    if (activeConversation && activeConversation.contactId === contactId) {
      setActiveConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.body,
          messages: [...prev.messages, newMessage]
        };
      });
    }
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully."
    });
  };
  
  const uploadContacts = (newContacts: Contact[]) => {
    // Generate IDs for the new contacts
    const contactsWithIds = newContacts.map(contact => ({
      ...contact,
      id: `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }));
    
    // Add the new contacts
    setContacts(prev => [...prev, ...contactsWithIds]);
    
    toast({
      title: "Contacts Uploaded",
      description: `${contactsWithIds.length} contacts have been uploaded successfully.`
    });
  };
  
  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      createdAt: new Date(),
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${newCampaign.name}" has been created successfully.`
    });
    
    return newCampaign;
  };
  
  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          status,
          ...(status === 'active' && { startedAt: new Date() }),
          ...(status === 'completed' && { completedAt: new Date() })
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Campaign Updated",
      description: `Campaign status has been updated to ${status}.`
    });
  };
  
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

  return (
    <AppContext.Provider 
      value={{
        campaigns: campaignsState,
        contacts: contactsState,
        conversations: conversationsState,
        templates: templatesState,
        metrics: metricsState,
        activeCampaign,
        activeConversation,
        activeTemplate,
        sidebarOpen,
        toggleSidebar,
        setCampaigns,
        setContacts,
        setConversations,
        setTemplates,
        setMetrics,
        setActiveCampaign,
        setActiveConversation,
        setActiveTemplate,
        sendMessage,
        uploadContacts,
        createCampaign,
        updateCampaignStatus,
        createTemplate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
