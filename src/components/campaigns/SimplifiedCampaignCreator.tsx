
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import CampaignCreator from './CampaignCreator';
import { CampaignType } from './CampaignTypeSelector';
import { Campaign } from '@/lib/types';
import TypeSelectionView from './creator/TypeSelectionView';
import { useCampaignTemplates } from '@/hooks/campaign-type/useCampaignTemplates';

interface SimplifiedCampaignCreatorProps {
  initialCampaignType?: CampaignType | null;
  campaign?: Campaign; // Added this line to accept a campaign for editing
  onCancel: () => void;
  onComplete: () => void;
}

const SimplifiedCampaignCreator: React.FC<SimplifiedCampaignCreatorProps> = ({ 
  initialCampaignType = null,
  campaign, // Added this parameter
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
  
  const { getCampaignTemplate } = useCampaignTemplates(templates);

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

  const handleCreateCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      createCampaign(campaignData);
      onComplete();
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCampaign = (campaignId: string, campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    setIsSubmitting(true);
    try {
      updateCampaign(campaignId, campaignData);
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

  if (step === 'type-selection') {
    return (
      <TypeSelectionView
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onCancel={onCancel}
      />
    );
  }

  return (
    <CampaignCreator
      campaign={campaign || getCampaignTemplate(selectedType) as any}
      contacts={contacts}
      contactLists={contactLists}
      templates={templates}
      knowledgeBases={knowledgeBases}
      onCreateCampaign={handleCreateCampaign}
      onUpdateCampaign={handleUpdateCampaign}
      onCancel={handleBack}
      isSubmitting={isSubmitting}
      campaignType={selectedType || undefined}
    />
  );
};

export default SimplifiedCampaignCreator;
