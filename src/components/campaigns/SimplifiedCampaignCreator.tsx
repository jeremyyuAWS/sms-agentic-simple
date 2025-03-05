import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Button } from '@/components/ui/button';
import CampaignCreator from './CampaignCreator';
import CampaignTypeSelector, { CampaignType } from './CampaignTypeSelector';
import { Campaign, TimeWindow, FollowUp } from '@/lib/types';
import { format } from 'date-fns';

interface SimplifiedCampaignCreatorProps {
  initialCampaignType?: CampaignType | null;
  onCancel: () => void;
  onComplete: () => void;
}

const SimplifiedCampaignCreator: React.FC<SimplifiedCampaignCreatorProps> = ({ 
  initialCampaignType = null,
  onCancel, 
  onComplete 
}) => {
  const { 
    contacts, 
    contactLists, 
    templates, 
    createCampaign, 
    updateCampaign,
    knowledgeBases
  } = useApp();
  
  const [step, setStep] = useState<'type-selection' | 'campaign-creation'>('type-selection');
  const [selectedType, setSelectedType] = useState<CampaignType | null>(initialCampaignType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCampaignType) {
      setSelectedType(initialCampaignType);
      setStep('campaign-creation');
    }
  }, [initialCampaignType]);

  const handleTypeSelect = (type: CampaignType) => {
    setSelectedType(type);
    setStep('campaign-creation');
  };

  const handleCreateCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      createCampaign(campaign);
      onComplete();
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCampaign = (campaignId: string, campaign: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    setIsSubmitting(true);
    try {
      updateCampaign(campaignId, campaign);
      onComplete();
    } catch (error) {
      console.error("Error updating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'campaign-creation') {
      setStep('type-selection');
    } else {
      onCancel();
    }
  };

  const getDefaultTemplateId = (type: CampaignType): string => {
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

  const getCampaignTemplate = (): Partial<Campaign> => {
    if (!selectedType) return {};
    
    const defaultStartDate = getDefaultStartDate(selectedType);
    const defaultTemplateId = getDefaultTemplateId(selectedType);
    const defaultSendingWindow = getDefaultSendingWindow(selectedType);
    const defaultTimeZone = '';
    const defaultFollowUps = getDefaultFollowUps(selectedType, defaultTemplateId);
    
    const templates: Record<CampaignType, Partial<Campaign>> = {
      'event-invitation': {
        name: '',
        description: '',
        goal: { type: 'event-promotion' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        contactCount: 0,
        followUps: defaultFollowUps
      },
      'sales-outreach': {
        name: '',
        description: '',
        goal: { type: 'sales' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'follow-up-reminder': {
        name: '',
        description: '',
        goal: { type: 'lead-generation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'meeting-scheduling': {
        name: '',
        description: '',
        goal: { type: 'lead-generation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'announcement': {
        name: '',
        description: '',
        goal: { type: 'product-announcement' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'customer-feedback': {
        name: '',
        description: '',
        goal: { type: 'customer-feedback' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'newsletter': {
        name: '',
        description: '',
        goal: { type: 'newsletter' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'promotional': {
        name: '',
        description: '',
        goal: { type: 'sales' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'seasonal': {
        name: '',
        description: '',
        goal: { type: 'other' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'survey': {
        name: '',
        description: '',
        goal: { type: 'survey' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'webinar-invitation': {
        name: '',
        description: '',
        goal: { type: 'webinar-invitation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'product-launch': {
        name: '',
        description: '',
        goal: { type: 'product-announcement' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'onboarding': {
        name: '',
        description: '',
        goal: { type: 'other' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'renewal': {
        name: '',
        description: '',
        goal: { type: 'sales' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      },
      'order-confirmation': {
        name: '',
        description: '',
        goal: { type: 'other' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: defaultFollowUps,
        contactCount: 0
      }
    };

    return selectedType ? templates[selectedType] : {};
  };

  if (step === 'type-selection') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        
        <CampaignTypeSelector
          selectedType={selectedType}
          onSelect={handleTypeSelect}
        />
      </div>
    );
  }

  return (
    <CampaignCreator
      campaign={getCampaignTemplate() as any}
      contacts={contacts}
      contactLists={contactLists}
      templates={templates}
      knowledgeBases={knowledgeBases}
      onCreateCampaign={handleCreateCampaign}
      onUpdateCampaign={handleUpdateCampaign}
      onCancel={handleBack}
      isSubmitting={isSubmitting}
    />
  );
};

export default SimplifiedCampaignCreator;
