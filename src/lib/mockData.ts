
import { Campaign, Contact, Conversation, Message, Template, MetricItem } from './types';
import { 
  MessageSquare, 
  BarChart,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// Mock templates
export const templates: Template[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    body: 'Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15'),
    variables: ['name']
  },
  {
    id: '2',
    name: 'Conference Follow-up',
    body: 'Hi {name}, it was great connecting at {conference}! Would you like to schedule a follow-up to discuss how we can help your business?',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-05'),
    variables: ['name', 'conference']
  },
  {
    id: '3',
    name: 'No Response Follow-up',
    body: 'Hi {name}, I wanted to follow up on my previous message. Are you interested in learning more about our solutions?',
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2023-10-10'),
    variables: ['name']
  }
];

// Mock campaigns
export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'SaaS Conference Outreach',
    description: 'Targeting attendees of the annual SaaS conference.',
    status: 'active',
    createdAt: new Date('2023-10-15'),
    startedAt: new Date('2023-10-16'),
    contactCount: 120,
    responseRate: 0.25,
    templateId: '2',
    timeZone: 'America/Los_Angeles',
    sendingWindow: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    }
  },
  {
    id: '2',
    name: 'Q4 Leads Follow-up',
    description: 'Following up with leads from Q3 who didn\'t respond.',
    status: 'draft',
    createdAt: new Date('2023-10-20'),
    contactCount: 85,
    templateId: '3',
    timeZone: 'America/New_York',
    sendingWindow: {
      startTime: '10:00',
      endTime: '16:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    }
  },
  {
    id: '3',
    name: 'New Product Announcement',
    description: 'Informing existing customers about our new product launch.',
    status: 'completed',
    createdAt: new Date('2023-09-01'),
    startedAt: new Date('2023-09-05'),
    completedAt: new Date('2023-09-12'),
    contactCount: 250,
    responseRate: 0.42,
    templateId: '1',
    timeZone: 'Europe/London',
    sendingWindow: {
      startTime: '09:00',
      endTime: '18:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    }
  }
];

// Mock contacts
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.smith@company.com',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    attendingConference: true,
    company: 'Acme Inc.',
    position: 'CTO'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phoneNumber: '+1 (555) 987-6543',
    email: 'sarah.j@tech.org',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    attendingConference: false,
    company: 'Tech Solutions',
    position: 'Marketing Director'
  },
  {
    id: '3',
    name: 'Michael Chen',
    phoneNumber: '+1 (555) 456-7890',
    email: 'michael.chen@innovate.io',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    attendingConference: true,
    company: 'Innovate IO',
    position: 'CEO'
  }
];

// Mock messages
export const messages: Message[] = [
  {
    id: '1',
    contactId: '1',
    campaignId: '1',
    body: 'Hi John, I'm Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    sentAt: new Date('2023-10-16T10:30:00'),
    status: 'delivered',
    type: 'outbound'
  },
  {
    id: '2',
    contactId: '1',
    campaignId: '1',
    body: 'Sure, I'd be interested in learning more. What's the best way to connect?',
    sentAt: new Date('2023-10-16T10:45:00'),
    status: 'received',
    type: 'inbound'
  },
  {
    id: '3',
    contactId: '1',
    campaignId: '1',
    body: 'Great! Here's a link to my calendar: calendly.com/alex-taikis. Looking forward to speaking with you!',
    sentAt: new Date('2023-10-16T10:47:00'),
    status: 'delivered',
    type: 'outbound'
  },
  {
    id: '4',
    contactId: '2',
    campaignId: '1',
    body: 'Hi Sarah, I'm Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    sentAt: new Date('2023-10-16T11:15:00'),
    status: 'delivered',
    type: 'outbound'
  },
  {
    id: '5',
    contactId: '2',
    campaignId: '1',
    body: 'Please remove me from your list.',
    sentAt: new Date('2023-10-16T11:30:00'),
    status: 'received',
    type: 'inbound'
  },
  {
    id: '6',
    contactId: '3',
    campaignId: '1',
    body: 'Hi Michael, I'm Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    sentAt: new Date('2023-10-16T12:00:00'),
    status: 'delivered',
    type: 'outbound'
  }
];

// Mock conversations
export const conversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'John Smith',
    contactPhone: '+1 (555) 123-4567',
    lastMessageAt: new Date('2023-10-16T10:47:00'),
    lastMessagePreview: 'Great! Here's a link to my calendar: calendly.com/alex-taikis. Looking forward to speaking with you!',
    status: 'interested',
    unreadCount: 0,
    messages: [messages[0], messages[1], messages[2]]
  },
  {
    id: '2',
    contactId: '2',
    contactName: 'Sarah Johnson',
    contactPhone: '+1 (555) 987-6543',
    lastMessageAt: new Date('2023-10-16T11:30:00'),
    lastMessagePreview: 'Please remove me from your list.',
    status: 'do-not-disturb',
    unreadCount: 1,
    messages: [messages[3], messages[4]]
  },
  {
    id: '3',
    contactId: '3',
    contactName: 'Michael Chen',
    contactPhone: '+1 (555) 456-7890',
    lastMessageAt: new Date('2023-10-16T12:00:00'),
    lastMessagePreview: 'Hi Michael, I'm Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    status: 'new',
    unreadCount: 0,
    messages: [messages[5]]
  }
];

// Mock metrics
export const metrics: MetricItem[] = [
  {
    label: 'Total Conversations',
    value: 385,
    previousValue: 310,
    change: 24.19,
    changeType: 'increase',
    icon: MessageSquare
  },
  {
    label: 'Response Rate',
    value: '32%',
    previousValue: '28%',
    change: 14.29,
    changeType: 'increase',
    icon: BarChart
  },
  {
    label: 'Meetings Booked',
    value: 42,
    previousValue: 36,
    change: 16.67,
    changeType: 'increase',
    icon: Calendar
  },
  {
    label: 'Successful Deliveries',
    value: '98%',
    previousValue: '97%',
    change: 1.03,
    changeType: 'increase',
    icon: CheckCircle2
  },
  {
    label: 'Opt-Out Rate',
    value: '3.2%',
    previousValue: '3.5%',
    change: -8.57,
    changeType: 'decrease',
    icon: AlertTriangle
  }
];
