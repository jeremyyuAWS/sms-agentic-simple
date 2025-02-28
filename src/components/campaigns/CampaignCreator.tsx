
import React from 'react';
import { 
  Campaign, 
  Contact, 
  ContactList, 
  Template, 
  KnowledgeBase, 
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CampaignContactSelection from './CampaignContactSelection';
import TemplateSelector from '@/components/templates/TemplateSelector';
import ScheduleCampaign from './ScheduleCampaign';
import LoadingState from '@/components/ui/loading-state';
import { useCampaignForm } from '@/hooks/use-campaign-form';

// Import subcomponents
import CampaignDetailsTab from './campaign-creator/CampaignDetailsTab';
import CampaignFollowupsTab from './campaign-creator/CampaignFollowupsTab';
import CampaignCreatorTabs from './campaign-creator/CampaignCreatorTabs';
import CampaignCreatorHeader from './campaign-creator/CampaignCreatorHeader';
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
  // Use our custom form hook
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

  // Use either external or internal submitting state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  // Render the content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <CampaignDetailsTab
            knowledgeBaseId={formState.knowledgeBaseId}
            knowledgeBases={knowledgeBases}
            onKnowledgeBaseSelect={(value) => handleInputChange('knowledgeBaseId', value)}
          />
        );
      case 'contacts':
        return (
          <CampaignContactSelection
            selectedContactIds={formState.contactIds}
            contactListId={formState.contactListId}
            segmentId={formState.segmentId}
            onContactsSelect={handleContactsSelect}
            onListSelect={handleListSelect}
            onSegmentSelect={handleSegmentSelect}
          />
        );
      case 'template':
        return (
          <TemplateSelector 
            onSelect={handleTemplateSelect} 
            selectedTemplateId={formState.templateId}
          />
        );
      case 'schedule':
        return (
          <ScheduleCampaign
            startDate={formState.scheduledStartDate}
            window={formState.sendingWindow}
            timezone={formState.timeZone}
            onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
            onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
            onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
          />
        );
      case 'followups':
        return (
          <CampaignFollowupsTab
            isFollowUpsEnabled={formState.isFollowUpsEnabled}
            setIsFollowUpsEnabled={setIsFollowUpsEnabled}
            followUps={formState.followUps}
            selectedTemplateId={formState.templateId}
            templates={templates}
            onFollowUpsChange={(followUps) => handleInputChange('followUps', followUps)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CampaignCreatorHeader isEditing={!!campaign} />
        <CardContent className="space-y-4">
          <LoadingState isLoading={isSubmitting} loadingText="Saving campaign...">
            {/* Campaign name and description (always visible) */}
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter campaign name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter campaign description"
                value={formState.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Navigation tabs */}
            <div className="overflow-x-auto">
              <CampaignCreatorTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>

            {/* Tab content */}
            {renderTabContent()}

            {/* Footer with action buttons */}
            <CampaignCreatorFooter
              isEditing={!!campaign}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={onCancel}
            />
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
