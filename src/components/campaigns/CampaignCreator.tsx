
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
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle } from 'lucide-react';

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

  // Function to render status badge
  const renderStatusBadge = (section: string) => {
    const isComplete = completedSections.includes(section);
    return (
      <Badge variant={isComplete ? "default" : "outline"} className={isComplete ? "bg-green-100 text-green-800 border-green-200" : ""}>
        {isComplete ? <Check className="w-3 h-3 mr-1" /> : null}
        {isComplete ? "Complete" : "Required"}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-4 md:py-6 max-w-4xl px-2 sm:px-4">
      <Card>
        <CampaignCreatorHeader isEditing={!!campaign} />
        <CardContent className="space-y-6 md:space-y-8 p-4 sm:p-6">
          <LoadingState isLoading={isSubmitting} loadingText="Saving campaign...">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - Campaign Details */}
              <div className="md:col-span-1 space-y-4 md:space-y-6">
                <div className="border rounded-lg p-3 md:p-4">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 flex justify-between items-center">
                    Campaign Details
                    {renderStatusBadge('details')}
                  </h2>
                  <div className="space-y-3 md:space-y-4">
                    <div>
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
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter campaign description"
                        value={formState.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-3 md:p-4">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 flex justify-between items-center">
                    Contacts
                    {renderStatusBadge('contacts')}
                  </h2>
                  <CampaignContactSelection
                    selectedContactIds={formState.contactIds}
                    contactListId={formState.contactListId}
                    segmentId={formState.segmentId}
                    onContactsSelect={handleContactsSelect}
                    onListSelect={handleListSelect}
                    onSegmentSelect={handleSegmentSelect}
                  />
                </div>
              </div>

              {/* Middle Column - Templates and Schedule */}
              <div className="md:col-span-1 space-y-4 md:space-y-6">
                <div className="border rounded-lg p-3 md:p-4">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 flex justify-between items-center">
                    Message Template
                    {renderStatusBadge('template')}
                  </h2>
                  <RecommendedTemplatesList
                    campaignType={campaignType}
                    templates={templates}
                    onSelectTemplate={(templateId) => handleInputChange('templateId', templateId)}
                    selectedTemplateId={formState.templateId}
                  />
                </div>

                <div className="border rounded-lg p-3 md:p-4">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 flex justify-between items-center">
                    Schedule
                    {renderStatusBadge('schedule')}
                  </h2>
                  <ScheduleCampaign
                    startDate={formState.scheduledStartDate}
                    window={formState.sendingWindow}
                    timezone={formState.timeZone}
                    onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
                    onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
                    onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
                  />
                </div>
              </div>

              {/* Right Column - Follow-ups */}
              <div className="md:col-span-1">
                <div className="border rounded-lg p-3 md:p-4 h-full">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 flex justify-between items-center">
                    Follow-up Sequence
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Pre-configured
                    </Badge>
                  </h2>
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
              </div>
            </div>
            
            <div className="flex justify-end mt-6 md:mt-8">
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
