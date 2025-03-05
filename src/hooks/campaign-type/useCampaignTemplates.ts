
import { CampaignType } from '@/components/campaigns/CampaignTypeSelector';
import { Campaign, Template } from '@/lib/types';
import { useCampaignTypeDefaults } from './useCampaignTypeDefaults';
import { useFollowUpConfiguration } from './useFollowUpConfiguration';

export const useCampaignTemplates = (templates: Template[]) => {
  const { getDefaultTemplateId, getDefaultSendingWindow, getDefaultStartDate } = useCampaignTypeDefaults();
  const { getDefaultFollowUps } = useFollowUpConfiguration();

  const getCampaignTemplate = (selectedType: CampaignType | null): Partial<Campaign> => {
    if (!selectedType) return {};
    
    const defaultStartDate = getDefaultStartDate(selectedType);
    const defaultTemplateId = getDefaultTemplateId(selectedType, templates);
    const defaultSendingWindow = getDefaultSendingWindow(selectedType);
    const defaultTimeZone = '';
    const defaultFollowUps = getDefaultFollowUps(selectedType, defaultTemplateId);
    
    const campaignTemplates: Record<CampaignType, Partial<Campaign>> = {
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

    return selectedType ? campaignTemplates[selectedType] : {};
  };

  return {
    getCampaignTemplate
  };
};
