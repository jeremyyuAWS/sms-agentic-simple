
import React from 'react';
import { 
  Campaign, 
  Contact, 
  ContactList, 
  Template, 
  KnowledgeBase, 
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import LoadingState from '@/components/ui/loading-state';
import { useCampaignForm } from '@/hooks/use-campaign-form';
import { useCampaignCompletion } from '@/hooks/use-campaign-completion';

// Import subcomponents
import CampaignCreatorHeader from './campaign-creator/CampaignCreatorHeader';
import CampaignTabs from './campaign-creator/CampaignTabs';
import CampaignCreatorFooter from './campaign-creator/CampaignCreatorFooter';

interface CampaignCreatorProps {
  campaign?: Campaign;
  contacts: Contact[];
  contactLists: ContactList[];
  templates: Template[];
  knowledgeBases: KnowledgeBase[];
  onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  onUpdateCampaign: (campaignId: string, campaign: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ 
  campaign,
  contacts,
  contactLists,
  templates,
  knowledgeBases,
  onCreateCampaign,
  onUpdateCampaign,
  onCancel,
  isSubmitting: externalIsSubmitting,
}) => {
  const { 
    formState,
    activeTab,
    isSubmitting: internalIsSubmitting,
    setActiveTab,
    handleInputChange,
    handleTemplateSelect,
    handleContactsSelect,
    handleListSelect,
    handleSegmentSelect,
    setIsFollowUpsEnabled,
    handleSubmit
  } = useCampaignForm({
    initialCampaign: campaign,
    onSubmit: (campaignId, formData) => {
      if (campaignId) {
        onUpdateCampaign(campaignId, formData);
      } else {
        onCreateCampaign(formData as Omit<Campaign, 'id' | 'createdAt'>);
      }
    }
  });
  
  const { completedSections, sectionApproved, handleSectionApproval } = useCampaignCompletion(formState);
  
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  // Handle approval of message sequence
  const handleMessageSequenceApproved = () => {
    handleSectionApproval('messaging', true);
  };

  return (
    <div className="container mx-auto py-6 md:py-8 max-w-5xl px-4">
      <Card className="shadow-md">
        <CampaignCreatorHeader isEditing={!!campaign} />
        <CardContent className="p-6">
          <LoadingState isLoading={isSubmitting} loadingText="Saving campaign...">
            <CampaignTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formState={formState}
              completedSections={completedSections}
              sectionApproved={sectionApproved}
              templates={templates}
              handleInputChange={handleInputChange}
              handleContactsSelect={handleContactsSelect}
              handleListSelect={handleListSelect}
              handleSegmentSelect={handleSegmentSelect}
              setIsFollowUpsEnabled={setIsFollowUpsEnabled}
              handleMessageSequenceApproved={handleMessageSequenceApproved}
            />
            
            <CampaignCreatorFooter
              isSubmitting={isSubmitting}
              onCancel={onCancel}
              onSubmit={handleSubmit}
              isEditing={!!campaign}
            />
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
