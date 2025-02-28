
import React, { useState, useEffect } from 'react';
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
import CampaignCreatorTabs, { CampaignCreatorTabType } from './campaign-creator/CampaignCreatorTabs';
import CampaignCreatorHeader from './campaign-creator/CampaignCreatorHeader';
import CampaignCreatorFooter from './campaign-creator/CampaignCreatorFooter';
import RecommendedTemplatesList from './RecommendedTemplatesList';
import CampaignSetupGuide from './CampaignSetupGuide';
import { CampaignType } from './CampaignTypeSelector';

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
  
  // Track completed tabs
  const [completedTabs, setCompletedTabs] = useState<CampaignCreatorTabType[]>([]);
  
  // Determine campaign type from name
  const getCampaignTypeFromName = (): CampaignType => {
    const typeMap: Record<string, CampaignType> = {
      'event': 'event-invitation',
      'sales': 'sales-outreach',
      'follow': 'follow-up-reminder',
      'meeting': 'meeting-scheduling',
      'announcement': 'announcement',
      'feedback': 'customer-feedback',
      'newsletter': 'newsletter',
      'promotion': 'promotional',
      'seasonal': 'seasonal',
      'survey': 'survey',
      'webinar': 'webinar-invitation'
    };
    
    const name = formState.name.toLowerCase();
    
    for (const [keyword, type] of Object.entries(typeMap)) {
      if (name.includes(keyword)) {
        return type;
      }
    }
    
    return 'sales-outreach'; // Default
  };
  
  // Check for completed tabs
  useEffect(() => {
    const completed: CampaignCreatorTabType[] = [];
    
    // Details tab
    if (formState.name && formState.description) {
      completed.push('details');
    }
    
    // Contacts tab
    if ((formState.contactIds && formState.contactIds.length > 0) || 
        formState.contactListId || 
        formState.segmentId) {
      completed.push('contacts');
    }
    
    // Template tab
    if (formState.templateId) {
      completed.push('template');
    }
    
    // Schedule tab
    if (formState.scheduledStartDate) {
      completed.push('schedule');
    }
    
    // Followups tab is always considered complete
    completed.push('followups');
    
    setCompletedTabs(completed);
  }, [formState]);

  // Use either external or internal submitting state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  // Render the content for the active tab
  const renderTabContent = () => {
    const campaignType = getCampaignTypeFromName();
    
    switch (activeTab) {
      case 'details':
        return (
          <>
            <CampaignSetupGuide campaignType={campaignType} currentStep="details" />
            <CampaignDetailsTab
              knowledgeBaseId={formState.knowledgeBaseId}
              knowledgeBases={knowledgeBases}
              onKnowledgeBaseSelect={(value) => handleInputChange('knowledgeBaseId', value)}
            />
          </>
        );
      case 'contacts':
        return (
          <>
            <CampaignSetupGuide campaignType={campaignType} currentStep="contacts" />
            <CampaignContactSelection
              selectedContactIds={formState.contactIds}
              contactListId={formState.contactListId}
              segmentId={formState.segmentId}
              onContactsSelect={handleContactsSelect}
              onListSelect={handleListSelect}
              onSegmentSelect={handleSegmentSelect}
            />
          </>
        );
      case 'template':
        return (
          <>
            <CampaignSetupGuide campaignType={campaignType} currentStep="template" />
            {/* Show recommended templates first */}
            <div className="mb-6">
              <RecommendedTemplatesList
                campaignType={campaignType}
                templates={templates}
                onSelectTemplate={(templateId) => handleInputChange('templateId', templateId)}
                selectedTemplateId={formState.templateId}
              />
            </div>
            
            {/* Then show the regular template selector */}
            <TemplateSelector 
              onSelect={(templateId) => handleInputChange('templateId', templateId)}
              selectedTemplateId={formState.templateId}
              knowledgeBaseId={formState.knowledgeBaseId}
              knowledgeBases={knowledgeBases}
            />
          </>
        );
      case 'schedule':
        return (
          <>
            <CampaignSetupGuide campaignType={campaignType} currentStep="schedule" />
            <ScheduleCampaign
              startDate={formState.scheduledStartDate}
              window={formState.sendingWindow}
              timezone={formState.timeZone}
              onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
              onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
              onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
            />
          </>
        );
      case 'followups':
        return (
          <>
            <CampaignSetupGuide campaignType={campaignType} currentStep="followups" />
            <CampaignFollowupsTab
              isFollowUpsEnabled={formState.isFollowUpsEnabled}
              setIsFollowUpsEnabled={setIsFollowUpsEnabled}
              followUps={formState.followUps}
              selectedTemplateId={formState.templateId}
              templates={templates}
              onFollowUpsChange={(followUps) => handleInputChange('followUps', followUps)}
              knowledgeBaseId={formState.knowledgeBaseId}
              knowledgeBases={knowledgeBases}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Check if we're on the last tab
  const isLastTab = activeTab === 'followups';

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
                activeTab={activeTab as CampaignCreatorTabType} 
                onTabChange={setActiveTab}
                completedTabs={completedTabs} 
              />
            </div>

            {/* Tab content */}
            {renderTabContent()}

            {/* Only show the create/save button on the last tab */}
            {isLastTab && (
              <div className="flex justify-end mt-8">
                <CampaignCreatorFooter
                  isEditing={!!campaign}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onCancel={onCancel}
                />
              </div>
            )}
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
