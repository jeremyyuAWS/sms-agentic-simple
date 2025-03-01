
import React, { useState, useEffect } from 'react';
import { 
  Campaign, 
  Contact, 
  ContactList, 
  Template, 
  KnowledgeBase, 
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CampaignContactSelection from './CampaignContactSelection';
import LoadingState from '@/components/ui/loading-state';
import { useCampaignForm } from '@/hooks/use-campaign-form';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

// Import subcomponents
import CampaignDetailsTab from './campaign-creator/CampaignDetailsTab';
import CampaignFollowupsTab from './campaign-creator/CampaignFollowupsTab';
import CampaignCreatorHeader from './campaign-creator/CampaignCreatorHeader';
import CampaignScheduleTab from './campaign-creator/CampaignScheduleTab';
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
  
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [sectionApproved, setSectionApproved] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    const completed: string[] = [];
    
    if (formState.name && formState.description) {
      completed.push('details');
    }
    
    if ((formState.contactIds && formState.contactIds.length > 0) || 
        formState.contactListId || 
        formState.segmentId) {
      completed.push('contacts');
    }
    
    if (formState.templateId) {
      completed.push('template');
    }
    
    if (formState.scheduledStartDate) {
      completed.push('schedule');
    }
    
    if (formState.isFollowUpsEnabled && formState.followUps.length > 0) {
      completed.push('followups');
    }
    
    setCompletedSections(completed);
  }, [formState]);

  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const renderStatusBadge = (section: string) => {
    const isComplete = completedSections.includes(section);
    const isSectionApproved = sectionApproved[section];
    
    if (!isComplete || (section === 'messaging' && !isSectionApproved)) {
      return (
        <Badge variant="outline" 
               className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Attention
        </Badge>
      );
    }
    
    // Complete sections still show green badge
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Complete
      </Badge>
    );
  };

  // Handle approval of message sequence
  const handleMessageSequenceApproved = () => {
    setSectionApproved(prev => ({...prev, messaging: true}));
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
                <TabsTrigger value="messaging" className="relative py-3">
                  Message Sequence
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('messaging')}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="contacts" className="relative py-3">
                  Audience
                  <span className="absolute top-0 right-1 -mt-1 -mr-1">
                    {renderStatusBadge('contacts')}
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
                <TabsContent value="details" className="space-y-6 mt-0">
                  <CampaignDetailsTab 
                    name={formState.name}
                    description={formState.description}
                    onNameChange={(value) => handleInputChange('name', value)}
                    onDescriptionChange={(value) => handleInputChange('description', value)}
                  />
                </TabsContent>

                <TabsContent value="messaging" className="space-y-6 mt-0">
                  <div className="space-y-8">
                    <CampaignFollowupsTab
                      isFollowUpsEnabled={formState.isFollowUpsEnabled}
                      setIsFollowUpsEnabled={setIsFollowUpsEnabled}
                      followUps={formState.followUps}
                      selectedTemplateId={formState.templateId}
                      templates={templates}
                      onFollowUpsChange={(followUps) => handleInputChange('followUps', followUps)}
                      onComplete={handleMessageSequenceApproved}
                    />
                  </div>
                </TabsContent>

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

                <TabsContent value="schedule" className="space-y-6 mt-0">
                  <CampaignScheduleTab
                    startDate={formState.scheduledStartDate}
                    window={formState.sendingWindow}
                    timezone={formState.timeZone}
                    onScheduleChange={(date) => handleInputChange('scheduledStartDate', date)}
                    onSendingWindowChange={(window) => handleInputChange('sendingWindow', window)}
                    onTimeZoneChange={(timezone) => handleInputChange('timeZone', timezone)}
                  />
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
