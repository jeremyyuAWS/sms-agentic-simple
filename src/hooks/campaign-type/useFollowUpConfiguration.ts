
import { CampaignType } from '@/components/campaigns/CampaignTypeSelector';
import { FollowUp } from '@/lib/types';

export const useFollowUpConfiguration = () => {
  const getDefaultFollowUps = (type: CampaignType, templateId: string): FollowUp[] => {
    const now = Date.now();
    
    const followUpConfigs: Record<CampaignType, FollowUp[]> = {
      'sales-outreach': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Value Proposition'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Case Study Share'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 12,
          enabled: true,
          condition: 'no-response',
          name: 'Final Opportunity'
        }
      ],
      'follow-up-reminder': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 2,
          enabled: true,
          condition: 'no-response',
          name: 'Gentle Reminder'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 5,
          enabled: true,
          condition: 'no-response',
          name: 'Additional Information'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 10,
          enabled: true,
          condition: 'no-response',
          name: 'Check-In'
        }
      ],
      'meeting-scheduling': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 2,
          enabled: true,
          condition: 'no-response',
          name: 'Availability Options'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 4,
          enabled: true,
          condition: 'no-response',
          name: 'Final Scheduling Attempt'
        }
      ],
      'customer-feedback': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Feedback Importance'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Last Chance for Input'
        }
      ],
      'promotional': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 1,
          enabled: true,
          condition: 'no-response',
          name: 'Special Offer Reminder'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Last Day of Promotion'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Extended Offer'
        }
      ],
      'survey': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 2,
          enabled: true,
          condition: 'no-response',
          name: 'Survey Reminder'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 5,
          enabled: true,
          condition: 'no-response',
          name: 'Final Day to Participate'
        }
      ],
      'webinar-invitation': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 5,
          enabled: true,
          condition: 'no-response',
          name: 'One Week Before Webinar'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 10,
          enabled: true,
          condition: 'no-response',
          name: 'Day Before Reminder'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 12,
          enabled: true,
          condition: 'no-response',
          name: 'Last Chance to Register'
        }
      ],
      'event-invitation': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Event Details Highlight'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 14,
          enabled: true,
          condition: 'no-response',
          name: 'One Week Until Event'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 20,
          enabled: true,
          condition: 'no-response',
          name: 'Final Reminder'
        }
      ],
      'announcement': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Announcement Reminder'
        }
      ],
      'newsletter': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Featured Article Highlight'
        }
      ],
      'seasonal': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 5,
          enabled: true,
          condition: 'no-response',
          name: 'Special Holiday Offer'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 10,
          enabled: true,
          condition: 'no-response',
          name: 'Last Day of Season'
        }
      ],
      'product-launch': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Product Features Highlight'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Early Adopter Offer'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 10,
          enabled: true,
          condition: 'no-response',
          name: 'Launch Day Reminder'
        },
        { 
          id: `followup-${now}-4`,
          templateId,
          delayDays: 15,
          enabled: true,
          condition: 'no-response',
          name: 'Post-Launch Feedback Request'
        }
      ],
      'onboarding': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 1,
          enabled: true,
          condition: 'no-response',
          name: 'Welcome Message'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          name: 'Getting Started Guide'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'First Feature Tutorial'
        },
        { 
          id: `followup-${now}-4`,
          templateId,
          delayDays: 14,
          enabled: true,
          condition: 'no-response',
          name: 'Check-In & Support Offer'
        },
        { 
          id: `followup-${now}-5`,
          templateId,
          delayDays: 30,
          enabled: true,
          condition: 'no-response',
          name: '30-Day Usage Review'
        }
      ],
      'renewal': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 30,
          enabled: true,
          condition: 'no-response',
          name: 'Early Renewal Notice'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 15,
          enabled: true,
          condition: 'no-response',
          name: 'Renewal Benefits'
        },
        { 
          id: `followup-${now}-3`,
          templateId,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          name: 'Final Renewal Reminder'
        }
      ],
      'order-confirmation': [
        { 
          id: `followup-${now}-1`,
          templateId,
          delayDays: 0,
          enabled: true,
          condition: 'no-response',
          name: 'Order Confirmation'
        },
        { 
          id: `followup-${now}-2`,
          templateId,
          delayDays: 1,
          enabled: true,
          condition: 'no-response',
          name: 'Shipping Notification'
        }
      ]
    };
    
    return followUpConfigs[type] || [];
  };

  return {
    getDefaultFollowUps
  };
};
