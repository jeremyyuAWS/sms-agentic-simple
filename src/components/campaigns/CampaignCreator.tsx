
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
import { Separator } from '@/components/ui/separator';
import CampaignContactSelection from './CampaignContactSelection';
import TemplateSelector from '@/components/templates/TemplateSelector';
import ScheduleCampaign from './ScheduleCampaign';
import LoadingState from '@/components/ui/loading-state';
import { useCampaignForm } from '@/hooks/use-campaign-form';

// Import subcomponents
import CampaignDetailsTab from './campaign-creator/CampaignDetailsTab';
import CampaignFollowupsTab from './campaign-creator/CampaignFollowupsTab';
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
    isSubmitting: internalIsSubmitting,
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
  
  // Track completion status
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
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
  
  // Check for completed sections
  useEffect(() => {
    const completed: string[] = [];
    
    // Details section
    if (formState.name && formState.description) {
      completed.push('details');
    }
    
    // Contacts section
    if ((formState.contactIds && formState.contactIds.length > 0) || 
        formState.contactListId || 
        formState.segmentId) {
      completed.push('contacts');
    }
    
    // Template section
    if (formState.templateId) {
      completed.push('template');
    }
    
    // Schedule section
    if (formState.scheduledStartDate) {
      completed.push('schedule');
    }
    
    // Followups section is always considered "complete" but we track it
    if (formState.isFollowUpsEnabled && formState.followUps.length > 0) {
      completed.push('followups');
    }
    
    setCompletedSections(completed);
  }, [formState]);

  // Use either external or internal submitting state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;
  const campaignType = getCampaignTypeFromName();

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CampaignCreatorHeader isEditing={!!campaign} />
        <CardContent className="space-y-8">
          <LoadingState isLoading={isSubmitting} loadingText="Saving campaign...">
            {/* Campaign name and description (always visible) */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Campaign Details</h2>
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
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Campaign Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Your campaign is pre-configured with optimal settings for your selected campaign type.
                  These settings include sending windows, follow-up sequences, and message scheduling.
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Contacts Section */}
            <div className="space-y-4">
              <CampaignSetupGuide campaignType={campaignType} currentStep="contacts" />
              <CampaignContactSelection
                selectedContactIds={formState.contactIds}
                contactListId={formState.contactListId}
                segmentId={formState.segmentId}
                onContactsSelect={handleContactsSelect}
                onListSelect={handleListSelect}
                onSegmentSelect={handleSegmentSelect}
              />
            </div>
            
            <Separator />
            
            {/* Message Template Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Message Template</h2>
              <CampaignSetupGuide campaignType={campaignType} currentStep="template" />
              <div className="mb-6">
                <RecommendedTemplatesList
                  campaignType={campaignType}
                  templates={templates}
                  onSelectTemplate={(templateId) => handleInputChange('templateId', templateId)}
                  selectedTemplateId={formState.templateId}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Schedule Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Campaign Schedule</h2>
              <CampaignSetupGuide campaignType={campaignType} currentStep="schedule" />
              <ScheduleCampaign
                startDate={formState.scheduledStartDate}
                window={formState.sendingWindow}
                timezone={formState.timeZone}
                onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
                onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
                onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
              />
            </div>
            
            <Separator />
            
            {/* Follow-ups Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Follow-up Messages</h2>
              <CampaignSetupGuide campaignType={campaignType} currentStep="followups" />
              <CampaignFollowupsTab
                isFollowUpsEnabled={formState.isFollowUpsEnabled}
                setIsFollowUpsEnabled={setIsFollowUpsEnabled}
                followUps={formState.followUps}
                selectedTemplateId={formState.templateId}
                templates={templates}
                onFollowUpsChange={(followUps) => handleInputChange('followUps', followUps)}
                onComplete={handleSubmit}
              />
            </div>
            
            {/* Footer with action buttons */}
            <div className="flex justify-end mt-8">
              <CampaignCreatorFooter
                isEditing={!!campaign}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancel={onCancel}
              />
            </div>
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
