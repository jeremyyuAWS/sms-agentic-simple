
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Button } from '@/components/ui/button';
import CampaignCreator from './CampaignCreator';
import CampaignTypeSelector, { CampaignType } from './CampaignTypeSelector';
import { Campaign, TimeWindow } from '@/lib/types';
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
    knowledgeBases, 
    createCampaign, 
    updateCampaign 
  } = useApp();
  
  const [step, setStep] = useState<'type-selection' | 'campaign-creation'>('type-selection');
  const [selectedType, setSelectedType] = useState<CampaignType | null>(initialCampaignType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If initialCampaignType is provided, skip type selection
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

  // Get a template ID based on campaign type (try to find a matching template by name)
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
      'webinar-invitation': 'Webinar Invitation'
    };

    const matchingTemplate = templates.find(t => 
      t.name.toLowerCase().includes(templateNameMap[type].toLowerCase())
    );

    return matchingTemplate?.id || templates[0]?.id || '';
  };

  // Get default sending window based on campaign type
  const getDefaultSendingWindow = (type: CampaignType): TimeWindow | undefined => {
    // Business hours for most campaign types
    const businessHours: TimeWindow = {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    };

    // Custom windows for specific campaign types
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
      }
    };

    return customWindows[type] || businessHours;
  };

  // Get default start date based on campaign type
  const getDefaultStartDate = (type: CampaignType): Date => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // For event invitations, set date a week from now
    if (type === 'event-invitation' || type === 'webinar-invitation') {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    
    return tomorrow;
  };

  // Pre-configure campaign based on type
  const getCampaignTemplate = (): Partial<Campaign> => {
    if (!selectedType) return {};
    
    // Default values for all campaign types
    const defaultStartDate = getDefaultStartDate(selectedType);
    const defaultTemplateId = getDefaultTemplateId(selectedType);
    const defaultSendingWindow = getDefaultSendingWindow(selectedType);
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Base templates for different campaign types
    const templates: Record<CampaignType, Partial<Campaign>> = {
      'event-invitation': {
        name: 'Event Invitation Campaign',
        description: 'Invite contacts to our upcoming quarterly conference on ' + format(defaultStartDate, 'MMMM d, yyyy'),
        goal: { type: 'event-promotion' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        contactCount: 0
      },
      'sales-outreach': {
        name: 'Sales Outreach Campaign',
        description: 'Connect with potential customers to promote our latest product features',
        goal: { type: 'sales' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 3,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'follow-up-reminder': {
        name: 'Follow-Up Campaign',
        description: 'Follow up with contacts who haven\'t responded to our initial outreach',
        goal: { type: 'lead-generation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 3,
          enabled: true,
          condition: 'no-response'
        }, { 
          id: `followup-${Date.now() + 1}`,
          templateId: '',
          delayDays: 7,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'meeting-scheduling': {
        name: 'Meeting Scheduler Campaign',
        description: 'Coordinate and schedule discovery calls with qualified leads',
        goal: { type: 'lead-generation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 2,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'announcement': {
        name: 'General Announcement',
        description: 'Share important company updates with our customer base',
        goal: { type: 'product-announcement' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        contactCount: 0
      },
      'customer-feedback': {
        name: 'Customer Feedback Campaign',
        description: 'Request feedback on recent customer experiences with our service',
        goal: { type: 'customer-feedback' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 4,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'newsletter': {
        name: 'Newsletter Campaign',
        description: 'Send monthly industry insights and company updates',
        goal: { type: 'newsletter' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        contactCount: 0
      },
      'promotional': {
        name: 'Promotional Campaign',
        description: 'Special discount offer for our premium tier subscription',
        goal: { type: 'sales' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 2,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'seasonal': {
        name: 'Seasonal Greeting Campaign',
        description: 'Send holiday wishes to our valued customers',
        goal: { type: 'other' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        contactCount: 0
      },
      'survey': {
        name: 'Survey Campaign',
        description: 'Collect insights on customer preferences for our next product update',
        goal: { type: 'survey' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 3,
          enabled: true,
          condition: 'no-response'
        }],
        contactCount: 0
      },
      'webinar-invitation': {
        name: 'Webinar Invitation Campaign',
        description: 'Invite contacts to our upcoming product demo webinar on ' + format(defaultStartDate, 'MMMM d, yyyy'),
        goal: { type: 'webinar-invitation' },
        templateId: defaultTemplateId,
        scheduledStartDate: defaultStartDate,
        sendingWindow: defaultSendingWindow,
        timeZone: defaultTimeZone,
        followUps: [{ 
          id: `followup-${Date.now()}`,
          templateId: '',
          delayDays: 1,
          enabled: true,
          condition: 'no-response'
        }],
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
