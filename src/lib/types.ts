
// Define common types for the application
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  linkedinUrl?: string;
  attendingConference?: boolean;
  [key: string]: any; // Allow for flexible fields
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  contactCount: number;
  messagesSent: number;
  responseRate: number;
}

export interface Message {
  id: string;
  contactId: string;
  campaignId: string;
  content: string;
  sentAt: Date;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface Conversation {
  id: string;
  contactId: string;
  lastMessage: string;
  lastMessageAt: Date;
  status: 'new' | 'active' | 'interested' | 'not-interested' | 'completed';
  unreadCount: number;
}
