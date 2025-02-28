
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Button } from '@/components/ui/button';
import CampaignCreator from './CampaignCreator';
import CampaignTypeSelector, { CampaignType } from './CampaignTypeSelector';
import { Campaign } from '@/lib/types';

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

  // Pre-configure campaign based on type
  const getCampaignTemplate = (): Partial<Campaign> => {
    const templates: Record<CampaignType, Partial<Campaign>> = {
      'event-invitation': {
        name: 'Event Invitation Campaign',
        description: 'Invite contacts to an upcoming event or conference',
        goal: { type: 'event-promotion' }
      },
      'sales-outreach': {
        name: 'Sales Outreach Campaign',
        description: 'Connect with potential customers to promote products or services',
        goal: { type: 'sales' }
      },
      'follow-up-reminder': {
        name: 'Follow-Up Campaign',
        description: 'Follow up with contacts who haven\'t responded',
        goal: { type: 'lead-generation' },
        isFollowUpsEnabled: true
      },
      'meeting-scheduling': {
        name: 'Meeting Scheduler Campaign',
        description: 'Coordinate and schedule meetings with prospects',
        goal: { type: 'lead-generation' }
      },
      'announcement': {
        name: 'General Announcement',
        description: 'Share important information or announcements',
        goal: { type: 'product-announcement' }
      },
      'customer-feedback': {
        name: 'Customer Feedback Campaign',
        description: 'Request feedback from your customers',
        goal: { type: 'customer-feedback' }
      },
      'newsletter': {
        name: 'Newsletter Campaign',
        description: 'Send regular updates and news to your contacts',
        goal: { type: 'newsletter' }
      },
      'promotional': {
        name: 'Promotional Campaign',
        description: 'Send special offers and promotions',
        goal: { type: 'sales' }
      },
      'seasonal': {
        name: 'Seasonal Greeting Campaign',
        description: 'Send holiday or seasonal greetings',
        goal: { type: 'other' }
      },
      'survey': {
        name: 'Survey Campaign',
        description: 'Collect data through structured surveys',
        goal: { type: 'survey' }
      },
      'webinar-invitation': {
        name: 'Webinar Invitation Campaign',
        description: 'Invite contacts to your online webinar',
        goal: { type: 'webinar-invitation' }
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
