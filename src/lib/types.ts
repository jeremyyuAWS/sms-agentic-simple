
// Define common types for the application
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  linkedinUrl?: string;
  attendingConference?: boolean;
  company?: string;
  position?: string;
  [key: string]: any; // Allow for flexible fields
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  contactCount: number;
  messagesSent?: number;
  responseRate?: number;
  startedAt?: Date;
  completedAt?: Date;
  templateId?: string;
  timeZone?: string;
  sendingWindow?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
}

export interface Message {
  id: string;
  contactId: string;
  campaignId: string;
  content: string;
  body?: string; // Adding for backward compatibility with existing code
  sentAt: Date;
  status: 'sending' | 'sent' | 'delivered' | 'failed' | 'received';
  type?: 'inbound' | 'outbound';
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName?: string;
  contactPhone?: string;
  lastMessage: string;
  lastMessageAt: Date;
  lastMessagePreview?: string;
  status: 'new' | 'active' | 'interested' | 'not-interested' | 'completed' | 'no-response' | 'do-not-disturb';
  unreadCount: number;
  messages?: Message[];
}

// Additional types used in the application
export interface Template {
  id: string;
  name: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  variables: string[];
}

export interface MetricItem {
  label: string;
  value: string | number;
  previousValue: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'no-change';
  icon?: React.ComponentType<any>;
}
