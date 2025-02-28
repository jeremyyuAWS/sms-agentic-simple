
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { Check, CheckCircle, InfoIcon } from 'lucide-react';

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
    <div className="container mx-auto py-6 md:py-8 max-w-5xl px-4">
      <Card className="shadow-md">
        <CampaignCreatorHeader isEditing={!!campaign} />
        <CardContent className="p-6">
          <LoadingState isLoading={isSubmitting} loadingText="Saving campaign...">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full space-y-6"
            >
              <TabsList className="w-full max-w-4xl mx-auto grid grid-cols-4 mb-6">
                <TabsTrigger value="details" className="relative py-3">
                  Campaign Details
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('details')}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="contacts" className="relative py-3">
                  Audience
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('contacts')}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="messaging" className="relative py-3">
                  Message Sequence
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('template')}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="relative py-3">
                  Schedule
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('schedule')}
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 px-2">
                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium">Campaign Name</Label>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter campaign name"
                        value={formState.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        aria-required="true"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-medium">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter campaign description"
                        value={formState.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="min-h-[120px] w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Best Practices */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mt-6">
                    <h3 className="text-lg font-medium mb-2 text-blue-700 flex items-center">
                      <InfoIcon className="h-5 w-5 mr-2" />
                      Campaign Best Practices
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5 text-sm text-blue-700 list-disc">
                      <li>Keep messages concise: SMS messages should be brief and to the point</li>
                      <li>Include a clear call-to-action in each message</li>
                      <li>Personalize messages with recipient's name when possible</li>
                      <li>Always identify yourself or your company in the first message</li>
                      <li>Send during business hours to maximize response rates</li>
                      <li>Follow up strategically - the sequence is pre-configured for optimal engagement</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Contacts Tab */}
                <TabsContent value="contacts" className="space-y-6 mt-0">
                  <CampaignContactSelection
                    selectedContactIds={formState.contactIds}
                    contactListId={formState.contactListId}
                    segmentId={formState.segmentId}
                    onContactsSelect={handleContactsSelect}
                    onListSelect={handleListSelect}
                    onSegmentSelect={handleSegmentSelect}
                  />
                </TabsContent>

                {/* Message Sequence Tab */}
                <TabsContent value="messaging" className="space-y-6 mt-0">
                  <div className="space-y-8">
                    <RecommendedTemplatesList
                      campaignType={campaignType}
                      templates={templates}
                      onSelectTemplate={(templateId) => handleInputChange('templateId', templateId)}
                      selectedTemplateId={formState.templateId}
                    />

                    <div className="border-t pt-6">
                      <CampaignFollowupsTab
                        isFollowUpsEnabled={formState.isFollowUpsEnabled}
                        setIsFollowUpsEnabled={setIsFollowUpsEnabled}
                        followUps={formState.followUps}
                        selectedTemplateId={formState.templateId}
                        templates={templates}
                        onFollowUpsChange={(followUps) => handleInputChange('followUps', followUps)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-6 mt-0">
                  <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Campaign Schedule</h2>
                    <ScheduleCampaign
                      startDate={formState.scheduledStartDate}
                      window={formState.sendingWindow}
                      timezone={formState.timeZone}
                      onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
                      onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
                      onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary"
              >
                {isSubmitting ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </div>
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
