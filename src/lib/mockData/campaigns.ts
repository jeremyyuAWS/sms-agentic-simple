
import { Campaign } from '../types';
import { subDays } from 'date-fns';

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
    performance: {
      totalResponses: 32,
      positiveResponses: 18,
      negativeResponses: 8,
      neutralResponses: 6,
      conversionCount: 12,
      goalCompletionRate: 0.37
    },
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
        templateId: "3",
        delayDays: 2,
        enabled: true,
        condition: "no-response"
      },
      {
        id: 'fu-2',
        name: "Case Study Sharing",
        templateId: "4",
        delayDays: 4,
        enabled: true,
        condition: "no-response"
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
        templateId: "3",
        delayDays: 3,
        enabled: true,
        condition: "no-response"
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
    performance: {
      totalResponses: 105,
      positiveResponses: 78,
      negativeResponses: 15,
      neutralResponses: 12,
      conversionCount: 42,
      goalCompletionRate: 0.40
    },
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
        templateId: "5",
        delayDays: 2,
        enabled: true,
        condition: "no-response"
      },
      {
        id: 'fu-5',
        name: "Early Adopter Incentive",
        templateId: "3",
        delayDays: 5,
        enabled: true,
        condition: "no-response"
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
    performance: {
      totalResponses: 9,
      positiveResponses: 7,
      negativeResponses: 1,
      neutralResponses: 1,
      conversionCount: 5,
      goalCompletionRate: 0.55
    },
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
        templateId: "3",
        delayDays: 3,
        enabled: true,
        condition: "no-response"
      },
      {
        id: 'fu-7',
        name: "ROI Calculator Offer",
        templateId: "4",
        delayDays: 5,
        enabled: true,
        condition: "no-response"
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
    performance: {
      totalResponses: 40,
      positiveResponses: 23,
      negativeResponses: 10,
      neutralResponses: 7,
      conversionCount: 16,
      goalCompletionRate: 0.40
    },
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
        templateId: "5",
        delayDays: 2,
        enabled: true,
        condition: "no-response"
      },
      {
        id: 'fu-9',
        name: "Special Return Offer",
        templateId: "3",
        delayDays: 4,
        enabled: true,
        condition: "no-response"
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
    performance: {
      totalResponses: 84,
      positiveResponses: 70,
      negativeResponses: 5,
      neutralResponses: 9,
      conversionCount: 32,
      goalCompletionRate: 0.38
    },
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
        templateId: "5",
        delayDays: 3,
        enabled: true,
        condition: "all"
      },
      {
        id: 'fu-11',
        name: "Usage Tips & Tricks",
        templateId: "4",
        delayDays: 6,
        enabled: true,
        condition: "all"
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
    performance: {
      totalResponses: 51,
      positiveResponses: 38,
      negativeResponses: 8,
      neutralResponses: 5,
      conversionCount: 27,
      goalCompletionRate: 0.71
    },
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
        templateId: "3",
        delayDays: 2,
        enabled: true,
        condition: "no-response"
      },
      {
        id: 'fu-13',
        name: "Industry Report Offer",
        templateId: "5",
        delayDays: 4,
        enabled: true,
        condition: "all"
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
    performance: {
      totalResponses: 56,
      positiveResponses: 32,
      negativeResponses: 15,
      neutralResponses: 9,
      conversionCount: 24,
      goalCompletionRate: 0.43
    },
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
        templateId: "5",
        delayDays: 2,
        enabled: true,
        condition: "all"
      },
      {
        id: 'fu-15',
        name: "ROI Calculator",
        templateId: "4",
        delayDays: 4,
        enabled: true,
        condition: "no-response"
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
        templateId: "4",
        delayDays: 3,
        enabled: true,
        condition: "all"
      },
      {
        id: 'fu-17',
        name: "2024 Feature Preview",
        templateId: "5",
        delayDays: 5,
        enabled: true,
        condition: "all"
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
        templateId: "5",
        delayDays: 2,
        enabled: true,
        condition: "all"
      },
      {
        id: 'fu-19',
        name: "Success Stories",
        templateId: "4",
        delayDays: 4,
        enabled: true,
        condition: "no-response"
      }
    ]
  }
];
