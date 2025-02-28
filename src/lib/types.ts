
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
  tags?: string[]; // Added for contact tagging
  source?: {
    type: 'csv' | 'manual' | 'import' | 'api';
    name: string;
    importedAt: Date;
    batchId: string; // To group contacts from the same import
  };
  [key: string]: any; // Allow for flexible fields
}

export interface ContactTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface ContactSegment {
  id: string;
  description?: string;
  name: string;
  filter: ContactFilter;
  count: number;
  createdAt: Date;
}

export interface ContactFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'exists' | 'notExists';
  value: any;
  logic?: 'and' | 'or';
  children?: ContactFilter[];
}

export interface FollowUp {
  id: string;
  templateId: string;
  delayDays: number;
  enabled: boolean;
  condition?: 'no-response' | 'all'; // When to send: only if no response, or to all contacts
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
  knowledgeBaseId?: string; // Reference to knowledge base document
  sendingWindow?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
  scheduledStartDate?: Date; // When to start sending the initial messages
  followUps?: FollowUp[]; // List of follow-up messages
  contactIds?: string[]; // Specific contact IDs to include
  segmentId?: string; // Reference to a saved segment
  customFilter?: ContactFilter; // Custom filter criteria
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

// New Knowledge Base type for PDF uploads
export interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf'; // Could expand to other types in the future
  fileName: string;
  fileSize: number;
  dateUploaded: Date;
  content: string; // Base64 encoded content of the PDF
  campaigns: string[]; // Campaign IDs that use this knowledge base
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

// New interface for contact import history
export interface ContactImport {
  id: string;
  name: string;
  filename: string;
  importedAt: Date;
  contactCount: number;
  status: 'completed' | 'failed' | 'processing';
  errorMessage?: string;
  source: 'csv' | 'api' | 'manual' | 'import';
}

// Field mapping interfaces for CSV import
export interface CSVField {
  name: string;
  description: string;
  required: boolean;
  example?: string;
  synonyms?: string[]; // Alternative field names
  validator?: (value: string) => boolean;
  formatter?: (value: string) => any;
}

export interface FieldMapping {
  csvHeader: string;
  mappedTo: string;
  confidence: number; // 0-1 score of mapping confidence
  description?: string;
  sample?: string;
  isCustomField?: boolean;
  dataType?: 'text' | 'email' | 'phone' | 'url' | 'boolean' | 'date' | 'number' | 'unknown';
}

// Time Zone related types
export interface TimeZoneOption {
  value: string;
  label: string;
  offset: string;
  abbr?: string;
}

export interface TimeWindowOption {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  label?: string;
}
