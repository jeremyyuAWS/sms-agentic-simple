
import { useState } from 'react';
import { Campaign, Conversation, Template } from '@/lib/types';

export const createUIStateActions = () => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // UI Actions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return {
    // State
    activeCampaign,
    activeConversation,
    activeTemplate,
    sidebarOpen,
    
    // Actions
    setActiveCampaign,
    setActiveConversation,
    setActiveTemplate,
    toggleSidebar
  };
};
