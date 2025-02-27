
import { LucideIcon } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  linkedinUrl?: string;
  attendingConference?: boolean;
  [key: string]: any; // For additional custom fields
}

export interface Message {
  id: string;
  contactId: string;
  campaignId: string;
  body: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed' | 'received';
  type: 'outbound' | 'inbound';
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  lastMessageAt: Date;
  lastMessagePreview: string;
  status: 'new' | 'active' | 'interested' | 'do-not-disturb' | 'no-response';
  unreadCount: number;
  messages: Message[];
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  contactCount: number;
  responseRate?: number;
  templateId: string;
  timeZone: string;
  sendingWindow: {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    daysOfWeek: number[]; // 0-6, where 0 is Sunday
  };
}

export interface Template {
  id: string;
  name: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  variables: string[]; // e.g., ['name', 'company']
}

export interface CSVField {
  name: string;
  description?: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date';
}

export interface MetricItem {
  label: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: LucideIcon;
}

export interface HeaderTab {
  id: string;
  label: string;
  icon?: React.ComponentType;
  href: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}
