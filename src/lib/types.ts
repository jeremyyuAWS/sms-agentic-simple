
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

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactIds: string[];
  createdAt: Date;
  updatedAt?: Date;
  source?: string;
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

export interface TimeWindow {
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface FollowUpCondition {
  type: 'no-response' | 'positive-response' | 'negative-response' | 'keyword' | 'all';
  keywords?: string[]; // For keyword-based conditions
  timeWindow?: TimeWindow; // Time window for sending
  excludeDays?: string[]; // Days to exclude (e.g., "Saturday", "Sunday")
}

export interface FollowUp {
  id: string;
  templateId: string;
  delayDays: number;
  enabled: boolean;
  priority?: number; // Higher number = higher priority
  condition?: 'no-response' | 'all'; // Legacy support
  conditions?: FollowUpCondition[]; // Enhanced conditions
  nextSteps?: { // For multi-step follow-up chains
    onResponse?: string; // ID of next follow-up if response received
    onNoResponse?: string; // ID of next follow-up if no response
  };
}

// Define campaign goal types
export type CampaignGoalType = 
  | 'lead-generation' 
  | 'sales' 
  | 'event-promotion' 
  | 'customer-feedback'
  | 'event-follow-up'
  | 'product-announcement'
  | 'survey'
  | 'webinar-invitation'
  | 'newsletter'
  | 'other';

// Campaign goal definition
export interface CampaignGoal {
  type: CampaignGoalType;
  description?: string;
  targetMetrics?: {
    responseRate?: number;
    conversionRate?: number;
    completionDays?: number;
  };
}

// New interfaces for A/B testing
export interface TemplateVariant {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  contactPercentage: number; // Percentage of contacts to receive this variant (0-100)
  contactCount?: number; // Number of contacts who received this variant
  responseRate?: number; // Response rate for this variant
  positiveResponseRate?: number; // Positive response rate
  negativeResponseRate?: number; // Negative response rate
  isWinner?: boolean; // Whether this variant has been selected as the winner
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
  contactListId?: string; // Reference to a contact list
  segmentId?: string; // Reference to a saved segment
  customFilter?: ContactFilter; // Custom filter criteria
  
  // A/B testing
  isABTest?: boolean; // Whether this campaign is an A/B test
  templateVariants?: TemplateVariant[]; // Template variants for A/B testing
  testDuration?: number; // Duration of the A/B test in hours before selecting a winner
  winnerSelectionCriteria?: 'response-rate' | 'positive-response-rate' | 'manual'; // How to select the winning template
  testWinnerTemplateId?: string; // ID of the template that won the test
  testStatus?: 'in-progress' | 'completed' | 'not-started'; // Status of the A/B test
  
  // New fields for campaign goals
  goal?: CampaignGoal;
  
  // New fields for validation and pre-launch checks
  validationStatus?: 'pending' | 'passed' | 'failed';
  validationIssues?: {
    type: 'error' | 'warning';
    message: string;
    field?: string;
  }[];
  
  // Performance tracking
  performance?: {
    totalResponses: number;
    positiveResponses: number;
    negativeResponses: number;
    neutralResponses: number;
    conversionCount: number;
    goalCompletionRate?: number;
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
  responseType?: 'positive' | 'negative' | 'neutral'; // Classification of response sentiment
  keywords?: string[]; // Extracted keywords from message
  templateId?: string; // ID of the template used for this message (for A/B testing)
  templateVariantId?: string; // ID of the template variant used (for A/B testing)
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

// Template Category type
export interface TemplateCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// Template Version for version history
export interface TemplateVersion {
  id: string;
  templateId: string;
  name: string;
  body: string;
  variables: string[];
  createdAt: Date;
  createdBy?: string; // User who created this version
  notes?: string; // Optional notes about the changes
}

// Template Usage Analytics
export interface TemplateUsage {
  templateId: string;
  usageCount: number;
  lastUsed?: Date;
  campaignIds: string[]; // Campaigns where this template was used
  responseRate?: number; // Average response rate
  positiveResponseRate?: number; // Percentage of positive responses
  negativeResponseRate?: number; // Percentage of negative responses
}

// Additional types used in the application
export interface Template {
  id: string;
  name: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  variables: string[];
  categoryIds?: string[]; // Reference to template categories
  isPublic?: boolean; // Whether this template can be shared
  sharedWith?: string[]; // IDs of users this template is shared with
  sharedById?: string; // ID of user who shared this template, if it's a shared template
  originalTemplateId?: string; // If this is a copy of a shared template, the ID of the original
  versionsCount?: number; // Number of versions available
  currentVersionId?: string; // ID of the current version
  usageStats?: TemplateUsage; // Usage statistics for this template
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

// New interface for campaign validation
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning';
  validate: (campaign: Campaign) => boolean;
  errorMessage: string;
  field?: string;
}

// Visual flow builder types
export interface FlowNode {
  id: string;
  type: 'template' | 'condition' | 'action' | 'start' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    templateId?: string;
    condition?: FollowUpCondition;
    action?: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'response' | 'no-response' | 'positive' | 'negative' | 'neutral' | 'default';
}

export interface CampaignFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
