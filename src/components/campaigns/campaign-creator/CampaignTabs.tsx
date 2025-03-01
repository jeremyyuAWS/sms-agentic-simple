
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import CampaignDetailsTab from './CampaignDetailsTab';
import CampaignFollowupsTab from './CampaignFollowupsTab';
import CampaignContactSelection from '../CampaignContactSelection';
import CampaignScheduleTab from './CampaignScheduleTab';
import { Template } from '@/lib/types';

interface CampaignTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  formState: any;
  completedSections: string[];
  sectionApproved: {[key: string]: boolean};
  templates: Template[];
  handleInputChange: (fieldName: string, value: any) => void;
  handleContactsSelect: (contacts: string[]) => void;
  handleListSelect: (listId?: string) => void;
  handleSegmentSelect: (segmentId?: string) => void;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  handleMessageSequenceApproved: () => void;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({
  activeTab,
  setActiveTab,
  formState,
  completedSections,
  sectionApproved,
  templates,
  handleInputChange,
  handleContactsSelect,
  handleListSelect,
  handleSegmentSelect,
  setIsFollowUpsEnabled,
  handleMessageSequenceApproved
}) => {
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

  return (
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
  );
};

export default CampaignTabs;
