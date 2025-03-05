
import { Campaign, Contact, Conversation, Message, Template, MetricItem } from './types';
import { 
  MessageSquare, 
  BarChart,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// Mock templates
export const templates: Template[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    body: 'Hi {name}, I\'m Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
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
  },
  {
    id: '4',
    name: 'Product Demo Invitation',
    body: 'Hi {name}, would you be interested in a personalized demo of our {product} solution? It takes just 15 minutes and I can show you how it can help with {pain_point}.',
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-12'),
    variables: ['name', 'product', 'pain_point']
  },
  {
    id: '5',
    name: 'New Feature Announcement',
    body: 'Hi {name}, I\'m excited to share that we\'ve just launched {feature_name} which addresses {pain_point} you mentioned in our last conversation. Would you like to see how it works?',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-10'),
    variables: ['name', 'feature_name', 'pain_point']
  }
];

// Generate richer campaign data
export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'SaaS Conference Outreach',
    description: 'Targeting attendees of the annual SaaS conference for product demos.',
    status: 'active',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15'),
    startedAt: new Date('2023-10-16'),
    contactCount: 120,
    responseRate: 0.25,
    templateId: '2',
    timeZone: 'America/Los_Angeles',
    sendingWindow: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    messagesSent: 87,
    responsesReceived: 32,
    positiveResponseCount: 18,
    meetings: 12,
    aiAnalysis: {
      trends: [
        "Response rates increased by 12% in the afternoon time slot",
        "Messages with company-specific context have 37% higher engagement",
        "Follow-ups scheduled on Tuesdays seeing 22% higher open rates"
      ],
      forecasts: [
        "Expected to reach 45% response rate by campaign end based on current trajectory",
        "Potential for 18 additional meetings with optimization of sending times",
        "Suggested follow-up timing adjustment could improve conversion by 15%"
      ]
    },
    followUps: [
      {
        id: 'fu-1',
        name: "Initial Value Proposition",
        description: "Highlights key benefits relevant to their industry",
        waitDays: 2,
        condition: "no_response",
        templateId: "3"
      },
      {
        id: 'fu-2',
        name: "Case Study Sharing",
        description: "Shares relevant success story from similar company",
        waitDays: 4,
        condition: "no_response",
        templateId: "4"
      }
    ]
  },
  {
    id: '2',
    name: 'Q4 Leads Follow-up',
    description: 'Following up with leads from Q3 who didn\'t respond.',
    status: 'draft',
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-10-20'),
    contactCount: 85,
    templateId: '3',
    timeZone: 'America/New_York',
    sendingWindow: {
      startTime: '10:00',
      endTime: '16:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    followUps: [
      {
        id: 'fu-3',
        name: "Value Proposition Follow-up",
        description: "Key benefits reminder with social proof",
        waitDays: 3,
        condition: "no_response",
        templateId: "3"
      }
    ]
  },
  {
    id: '3',
    name: 'New Product Announcement',
    description: 'Informing existing customers about our new product launch.',
    status: 'completed',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01'),
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
    },
    messagesSent: 250,
    responsesReceived: 105,
    positiveResponseCount: 78,
    meetings: 42,
    aiAnalysis: {
      insights: [
        "Customers in the Technology sector responded 38% more positively than average",
        "Messages delivered between 10-11am had 45% higher response rates",
        "89% of positive responses came from customers with 2+ years of history"
      ],
      trends: [
        "Response rates climbed steadily through campaign duration",
        "Follow-up 2 outperformed expectations with 28% conversion rate",
        "Messages with personalized subject lines saw 31% higher engagement"
      ]
    },
    followUps: [
      {
        id: 'fu-4',
        name: "Feature Highlight",
        description: "Focused on the most popular new feature",
        waitDays: 2,
        condition: "no_response",
        templateId: "5"
      },
      {
        id: 'fu-5',
        name: "Early Adopter Incentive",
        description: "Special offer for early feature adoption",
        waitDays: 5,
        condition: "no_response",
        templateId: "3"
      }
    ]
  },
  {
    id: '4',
    name: 'Enterprise Decision-Maker Outreach',
    description: 'Targeted campaign for C-level executives at enterprise companies',
    status: 'active',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01'),
    startedAt: new Date('2023-11-05'),
    contactCount: 75,
    responseRate: 0.18,
    templateId: '1',
    timeZone: 'America/Chicago',
    sendingWindow: {
      startTime: '08:00',
      endTime: '10:00',
      daysOfWeek: [2, 4]
    },
    messagesSent: 48,
    responsesReceived: 9,
    positiveResponseCount: 7,
    meetings: 5,
    aiAnalysis: {
      trends: [
        "Early morning messages (8-9am) receiving 27% higher open rates",
        "Executives from financial sector showing 32% higher engagement",
        "Messages with ROI statements have 41% higher response rate"
      ],
      forecasts: [
        "Campaign trending toward 22% final response rate based on current data",
        "Potential to secure 8-10 additional meetings with message optimization",
        "Adding industry-specific case studies could improve engagement by 35%"
      ]
    },
    followUps: [
      {
        id: 'fu-6',
        name: "Executive Summary",
        description: "Concise business value proposition",
        waitDays: 3,
        condition: "no_response",
        templateId: "3"
      },
      {
        id: 'fu-7',
        name: "ROI Calculator Offer",
        description: "Personalized ROI projection tool",
        waitDays: 5,
        condition: "no_response",
        templateId: "4"
      }
    ]
  },
  {
    id: '5',
    name: 'Reactivation Campaign',
    description: 'Re-engaging with dormant accounts showing recent interest',
    status: 'active',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
    startedAt: new Date('2023-11-15'),
    contactCount: 180,
    responseRate: 0.31,
    templateId: '3',
    timeZone: 'America/Los_Angeles',
    sendingWindow: {
      startTime: '11:00',
      endTime: '15:00',
      daysOfWeek: [1, 3, 5]
    },
    messagesSent: 128,
    responsesReceived: 40,
    positiveResponseCount: 23,
    meetings: 16,
    aiAnalysis: {
      trends: [
        "Accounts dormant 6-12 months responding 42% better than longer term inactive",
        "Personalized usage history highlights increasing engagement by 38%",
        "Friday messages showing 22% higher open and response rates"
      ],
      forecasts: [
        "Campaign on track to reactivate approximately 45 dormant accounts",
        "Data suggests potential for 29% conversion to paid upgrades",
        "Segmenting by industry could improve targeting precision by 33%"
      ]
    },
    followUps: [
      {
        id: 'fu-8',
        name: "New Features Overview",
        description: "Highlights improvements since last engagement",
        waitDays: 2,
        condition: "no_response",
        templateId: "5"
      },
      {
        id: 'fu-9',
        name: "Special Return Offer",
        description: "Incentive for reactivating account",
        waitDays: 4,
        condition: "no_response",
        templateId: "3"
      }
    ]
  },
  {
    id: '6',
    name: 'Product Education Series',
    description: 'Educational campaign targeting recently onboarded customers',
    status: 'active',
    createdAt: new Date('2023-11-18'),
    updatedAt: new Date('2023-11-18'),
    startedAt: new Date('2023-11-22'),
    contactCount: 210,
    responseRate: 0.48,
    templateId: '4',
    timeZone: 'Europe/Berlin',
    sendingWindow: {
      startTime: '10:00',
      endTime: '16:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    messagesSent: 175,
    responsesReceived: 84,
    positiveResponseCount: 70,
    meetings: 32,
    aiAnalysis: {
      trends: [
        "Tutorial links receiving 68% higher click-through than product overview content",
        "Video content engagement 127% higher than text-only messages",
        "Questions requesting specific feature help getting 83% response rate"
      ],
      forecasts: [
        "Campaign trajectory suggests 52% of recipients will engage with at least 3 tutorials",
        "Data indicates 40% reduction in support tickets from campaign participants",
        "Adding interactive tutorials could increase engagement by estimated 35%"
      ]
    },
    followUps: [
      {
        id: 'fu-10',
        name: "Feature Deep Dive",
        description: "In-depth explanation of most valuable feature",
        waitDays: 3,
        condition: "opened",
        templateId: "5"
      },
      {
        id: 'fu-11',
        name: "Usage Tips & Tricks",
        description: "Practical applications and power user tips",
        waitDays: 6,
        condition: "responded",
        templateId: "4"
      }
    ]
  },
  {
    id: '7',
    name: 'Industry Conference Networking',
    description: 'Follow-up with connections made at FinTech Summit',
    status: 'completed',
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-08-10'),
    startedAt: new Date('2023-08-15'),
    completedAt: new Date('2023-08-28'),
    contactCount: 95,
    responseRate: 0.54,
    templateId: '2',
    timeZone: 'America/New_York',
    sendingWindow: {
      startTime: '09:30',
      endTime: '16:30',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    messagesSent: 95,
    responsesReceived: 51,
    positiveResponseCount: 38,
    meetings: 27,
    aiAnalysis: {
      insights: [
        "Contacts who attended your presentation responded 78% more frequently",
        "Mentioning specific conversation topics increased response rate by 62%",
        "Follow-ups sent within 48 hours of conference end had 43% higher engagement"
      ],
      trends: [
        "Response quality correlated strongly with seniority level",
        "Mid-size company representatives had highest meeting conversion rate (42%)",
        "Specific product interest mentioned in 76% of positive responses"
      ]
    },
    followUps: [
      {
        id: 'fu-12',
        name: "Conference Highlights",
        description: "Recap of key points from presentation",
        waitDays: 2,
        condition: "no_response",
        templateId: "3"
      },
      {
        id: 'fu-13',
        name: "Industry Report Offer",
        description: "Exclusive research report mentioned at event",
        waitDays: 4,
        condition: "opened",
        templateId: "5"
      }
    ]
  },
  {
    id: '8',
    name: 'Upsell Campaign - Pro Features',
    description: 'Targeting basic-tier customers with high usage patterns',
    status: 'completed',
    createdAt: new Date('2023-09-20'),
    updatedAt: new Date('2023-09-20'),
    startedAt: new Date('2023-09-25'),
    completedAt: new Date('2023-10-15'),
    contactCount: 150,
    responseRate: 0.37,
    templateId: '5',
    timeZone: 'Asia/Singapore',
    sendingWindow: {
      startTime: '10:00',
      endTime: '18:00',
      daysOfWeek: [1, 3, 5]
    },
    messagesSent: 150,
    responsesReceived: 56,
    positiveResponseCount: 32,
    meetings: 24,
    aiAnalysis: {
      insights: [
        "Customers approaching usage limits had 72% higher conversion rates",
        "Highlighting specific ROI metrics increased upgrades by 48%",
        "Accounts with 5+ active users were 3.2x more likely to upgrade"
      ],
      trends: [
        "Conversion rates spiked after feature comparison messages",
        "Second follow-up timing (day 4) showed optimal engagement window",
        "Enterprise feature previews generated 58% more inquiries than discount offers"
      ]
    },
    followUps: [
      {
        id: 'fu-14',
        name: "Pro Feature Showcase",
        description: "Visual comparison of basic vs pro features",
        waitDays: 2,
        condition: "opened",
        templateId: "5"
      },
      {
        id: 'fu-15',
        name: "ROI Calculator",
        description: "Personalized value assessment for upgrade",
        waitDays: 4,
        condition: "no_response",
        templateId: "4"
      }
    ]
  },
  {
    id: '9',
    name: 'Year-End Review & Planning',
    description: 'Strategic planning outreach to existing customer base',
    status: 'draft',
    createdAt: new Date('2023-11-25'),
    updatedAt: new Date('2023-11-25'),
    contactCount: 230,
    templateId: '1',
    timeZone: 'America/Chicago',
    sendingWindow: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    followUps: [
      {
        id: 'fu-16',
        name: "Usage Report Share",
        description: "Personalized annual usage statistics",
        waitDays: 3,
        condition: "opened",
        templateId: "4"
      },
      {
        id: 'fu-17',
        name: "2024 Feature Preview",
        description: "Roadmap and coming enhancements",
        waitDays: 5,
        condition: "responded",
        templateId: "5"
      }
    ]
  },
  {
    id: '10',
    name: 'Regional Partner Recruitment',
    description: 'Targeting potential resellers in expansion territories',
    status: 'draft',
    createdAt: new Date('2023-11-30'),
    updatedAt: new Date('2023-11-30'),
    contactCount: 80,
    templateId: '3',
    timeZone: 'Europe/Paris',
    sendingWindow: {
      startTime: '10:30',
      endTime: '15:30',
      daysOfWeek: [2, 4]
    },
    followUps: [
      {
        id: 'fu-18',
        name: "Partnership Model Overview",
        description: "Detailed breakdown of partner program",
        waitDays: 2,
        condition: "opened",
        templateId: "5"
      },
      {
        id: 'fu-19',
        name: "Success Stories",
        description: "Case studies from existing partners",
        waitDays: 4,
        condition: "no_response",
        templateId: "4"
      }
    ]
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

// Generate more dynamic message data for richer demo
const generateMessages = () => {
  const now = new Date();
  let messageId = 1;
  let allMessages: Message[] = [];
  
  // Generate messages for each campaign
  campaigns.filter(c => c.status !== 'draft').forEach(campaign => {
    const campaignContacts = contacts.slice(0, campaign.contactCount || 3);
    const messageCount = campaign.messagesSent || Math.floor(Math.random() * 50) + 10;
    const responseRate = campaign.responseRate || Math.random() * 0.5;
    
    // Generate initial outbound messages
    campaignContacts.slice(0, messageCount).forEach((contact, idx) => {
      // Create outbound message
      const sentDate = subDays(now, Math.floor(Math.random() * 14));
      const outboundMsg: Message = {
        id: String(messageId++),
        contactId: contact.id,
        campaignId: campaign.id,
        content: `Hi ${contact.name}, this is a personalized message for our ${campaign.name} campaign.`,
        body: `Hi ${contact.name}, this is a personalized message for our ${campaign.name} campaign.`,
        sentAt: sentDate,
        status: 'delivered',
        type: 'outbound'
      };
      allMessages.push(outboundMsg);
      
      // Add responses based on response rate
      if (Math.random() < responseRate) {
        const responseTypes = ['positive', 'negative', 'neutral'];
        const responseType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
        const responseDelay = Math.floor(Math.random() * 120) + 10; // 10-130 minutes
        
        const responseContent = responseType === 'positive' 
          ? "Thanks for reaching out! I'd like to learn more about this."
          : responseType === 'negative'
            ? "Not interested at this time, please remove me from your list."
            : "Can you provide more information about what you're offering?";
        
        const inboundMsg: Message = {
          id: String(messageId++),
          contactId: contact.id,
          campaignId: campaign.id,
          content: responseContent,
          body: responseContent,
          sentAt: new Date(sentDate.getTime() + responseDelay * 60000),
          status: 'received',
          type: 'inbound',
          responseType: responseType
        };
        allMessages.push(inboundMsg);
        
        // Add follow-up for positive/neutral responses
        if (responseType !== 'negative' && Math.random() > 0.3) {
          const followUpDelay = Math.floor(Math.random() * 90) + 30; // 30-120 minutes
          const followUpContent = "Great! I'd be happy to share more details. How about a quick call next week?";
          
          const followUpMsg: Message = {
            id: String(messageId++),
            contactId: contact.id,
            campaignId: campaign.id,
            content: followUpContent,
            body: followUpContent,
            sentAt: new Date(inboundMsg.sentAt.getTime() + followUpDelay * 60000),
            status: 'delivered',
            type: 'outbound'
          };
          allMessages.push(followUpMsg);
        }
      }
    });
  });
  
  return allMessages;
};

// Generate all messages
export const messages: Message[] = generateMessages();

// Generate more dynamic conversations from messages
export const conversations: Conversation[] = (() => {
  const conversationsMap = new Map<string, Conversation>();
  
  // Group messages by contact
  messages.forEach(message => {
    const key = message.contactId;
    const contact = contacts.find(c => c.id === message.contactId);
    
    if (!contact) return;
    
    if (!conversationsMap.has(key)) {
      conversationsMap.set(key, {
        id: `conv-${key}`,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phoneNumber,
        lastMessage: message.content,
        lastMessageAt: message.sentAt,
        lastMessagePreview: message.content.substring(0, 100),
        status: 'new',
        unreadCount: message.type === 'inbound' ? 1 : 0,
        messages: [message]
      });
    } else {
      const conversation = conversationsMap.get(key)!;
      conversation.messages.push(message);
      
      // Update last message info if this is newer
      if (message.sentAt > conversation.lastMessageAt) {
        conversation.lastMessage = message.content;
        conversation.lastMessageAt = message.sentAt;
        conversation.lastMessagePreview = message.content.substring(0, 100);
        
        // Update unread count for inbound messages
        if (message.type === 'inbound') {
          conversation.unreadCount += 1;
        }
      }
      
      // Update conversation status based on messages
      const hasPositive = conversation.messages.some(
        m => m.type === 'inbound' && m.responseType === 'positive'
      );
      const hasNegative = conversation.messages.some(
        m => m.type === 'inbound' && m.responseType === 'negative'
      );
      
      if (hasNegative) {
        conversation.status = 'do-not-disturb';
      } else if (hasPositive) {
        conversation.status = 'interested';
      } else if (conversation.messages.some(m => m.type === 'inbound')) {
        conversation.status = 'responded';
      }
    }
  });
  
  return Array.from(conversationsMap.values());
})();

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

