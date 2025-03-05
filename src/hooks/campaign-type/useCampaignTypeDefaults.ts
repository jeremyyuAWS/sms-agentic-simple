
import { CampaignType } from '@/components/campaigns/CampaignTypeSelector';
import { Campaign, TimeWindow, FollowUp, Template } from '@/lib/types';
import { format } from 'date-fns';

export const useCampaignTypeDefaults = () => {
  const getDefaultTemplateId = (type: CampaignType, templates: Template[]): string => {
    const templateNameMap: Record<CampaignType, string> = {
      'event-invitation': 'Event Invitation',
      'sales-outreach': 'Sales Outreach',
      'follow-up-reminder': 'Follow-up Template',
      'meeting-scheduling': 'Meeting Request',
      'announcement': 'Company Announcement',
      'customer-feedback': 'Feedback Request',
      'newsletter': 'Newsletter',
      'promotional': 'Special Offer',
      'seasonal': 'Seasonal Greeting',
      'survey': 'Customer Survey',
      'webinar-invitation': 'Webinar Invitation',
      'product-launch': 'Product Launch',
      'onboarding': 'Customer Onboarding',
      'renewal': 'Subscription Renewal',
      'order-confirmation': 'Order Confirmation'
    };

    const matchingTemplate = templates.find(t => 
      t.name.toLowerCase().includes(templateNameMap[type].toLowerCase())
    );

    return matchingTemplate?.id || templates[0]?.id || '';
  };

  const getDefaultSendingWindow = (type: CampaignType): TimeWindow | undefined => {
    const businessHours: TimeWindow = {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    };

    const customWindows: Record<string, TimeWindow> = {
      'promotional': {
        startTime: '12:00',
        endTime: '20:00',
        daysOfWeek: [1, 2, 3, 4, 5, 6] // Monday to Saturday
      },
      'newsletter': {
        startTime: '07:00',
        endTime: '10:00',
        daysOfWeek: [2, 4] // Tuesday and Thursday mornings
      },
      'product-launch': {
        startTime: '10:00',
        endTime: '16:00',
        daysOfWeek: [2, 3, 4] // Tuesday, Wednesday, Thursday
      },
      'onboarding': {
        startTime: '09:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
      },
      'renewal': {
        startTime: '10:00',
        endTime: '17:00',
        daysOfWeek: [1, 3, 5] // Monday, Wednesday, Friday
      },
      'order-confirmation': {
        startTime: '08:00',
        endTime: '20:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All days
      }
    };

    return customWindows[type] || businessHours;
  };

  const getDefaultStartDate = (type: CampaignType): Date => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (type === 'event-invitation' || type === 'webinar-invitation') {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    
    if (type === 'product-launch') {
      const twoWeeks = new Date(now);
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      return twoWeeks;
    }
    
    if (type === 'order-confirmation') {
      return now; // Immediate start
    }
    
    return tomorrow;
  };

  return {
    getDefaultTemplateId,
    getDefaultSendingWindow,
    getDefaultStartDate
  };
};
