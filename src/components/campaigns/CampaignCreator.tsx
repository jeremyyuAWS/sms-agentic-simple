
import React, { useState, useEffect } from 'react';
import { 
  Campaign, 
  Contact, 
  ContactList, 
  Template, 
  KnowledgeBase, 
  TimeWindow 
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CampaignContactSelection from './CampaignContactSelection';
import TemplateSelector, { CampaignTemplate } from '@/components/templates/TemplateSelector';
import ScheduleCampaign from './ScheduleCampaign';

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
  isSubmitting
}) => {
  // State for campaign data
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(campaign?.templateId || '');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState(campaign?.knowledgeBaseId || '');
  const [scheduledStartDate, setScheduledStartDate] = useState<Date | undefined>(campaign?.scheduledStartDate);
  const [timeZone, setTimeZone] = useState(campaign?.timeZone || 'America/Los_Angeles');
  const [sendingWindow, setSendingWindow] = useState<TimeWindow | undefined>(campaign?.sendingWindow);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(campaign?.contactIds || []);
  const [contactListId, setContactListId] = useState<string | undefined>(campaign?.contactListId);
  const [segmentId, setSegmentId] = useState<string | undefined>(campaign?.segmentId);
  const [followUps, setFollowUps] = useState(campaign?.followUps || []);
  const [isFollowUpsEnabled, setIsFollowUpsEnabled] = useState<boolean>(campaign?.followUps && campaign.followUps.length > 0);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('details');

  // Input change handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplateId(template.id);
  };

  const handleKnowledgeBaseSelect = (value: string) => {
    setKnowledgeBaseId(value);
  };

  const handleScheduleChange = (date: Date) => {
    setScheduledStartDate(date);
  };

  const handleTimeZoneChange = (timezone: string) => {
    setTimeZone(timezone);
  };

  const handleSendingWindowChange = (window: TimeWindow | undefined) => {
    setSendingWindow(window);
  };

  const handleContactsSelect = (contacts: string[]) => {
    setSelectedContactIds(contacts);
  };

  const handleListSelect = (listId?: string) => {
    setContactListId(listId);
    setSegmentId(undefined);
    setSelectedContactIds([]);
  };

  const handleSegmentSelect = (segmentId?: string) => {
    setSegmentId(segmentId);
    setContactListId(undefined);
    setSelectedContactIds([]);
  };

  const handleFollowUpsChange = (updatedFollowUps: any[]) => {
    setFollowUps(updatedFollowUps);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmit = () => {
    // Prepare campaign data for submission
    const now = new Date();
    const campaignData = {
      name,
      description,
      templateId: selectedTemplateId,
      knowledgeBaseId,
      scheduledStartDate,
      timeZone,
      sendingWindow,
      contactIds: selectedContactIds,
      contactListId,
      segmentId,
      followUps: isFollowUpsEnabled ? followUps : [],
      status: 'draft' as 'draft' | 'active' | 'paused' | 'completed',
      updatedAt: now,
      contactCount: selectedContactIds.length || 0
    };

    if (campaign) {
      onUpdateCampaign(campaign.id, campaignData);
    } else {
      onCreateCampaign(campaignData);
    }
  };

  // Update state when campaign prop changes
  useEffect(() => {
    if (campaign) {
      setName(campaign.name || '');
      setDescription(campaign.description || '');
      setSelectedTemplateId(campaign.templateId || '');
      setKnowledgeBaseId(campaign.knowledgeBaseId || '');
      setScheduledStartDate(campaign.scheduledStartDate);
      setTimeZone(campaign.timeZone || 'America/Los_Angeles');
      setSendingWindow(campaign.sendingWindow);
      setSelectedContactIds(campaign.contactIds || []);
      setContactListId(campaign.contactListId);
      setSegmentId(campaign.segmentId);
      setFollowUps(campaign.followUps || []);
      setIsFollowUpsEnabled(campaign.followUps && campaign.followUps.length > 0);
    }
  }, [campaign]);

  // Render the content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <CampaignDetailsTab
            knowledgeBaseId={knowledgeBaseId}
            knowledgeBases={knowledgeBases}
            onKnowledgeBaseSelect={handleKnowledgeBaseSelect}
          />
        );
      case 'contacts':
        return (
          <CampaignContactSelection
            selectedContactIds={selectedContactIds}
            contactListId={contactListId}
            segmentId={segmentId}
            onContactsSelect={handleContactsSelect}
            onListSelect={handleListSelect}
            onSegmentSelect={handleSegmentSelect}
          />
        );
      case 'template':
        return (
          <TemplateSelector onSelect={handleTemplateSelect} />
        );
      case 'schedule':
        return (
          <ScheduleCampaign
            startDate={scheduledStartDate}
            window={sendingWindow}
            timezone={timeZone}
            onScheduleChange={handleScheduleChange}
            onSendingWindowChange={handleSendingWindowChange}
            onTimeZoneChange={handleTimeZoneChange}
          />
        );
      case 'followups':
        return (
          <CampaignFollowupsTab
            isFollowUpsEnabled={isFollowUpsEnabled}
            setIsFollowUpsEnabled={setIsFollowUpsEnabled}
            followUps={followUps}
            selectedTemplateId={selectedTemplateId}
            templates={templates}
            onFollowUpsChange={handleFollowUpsChange}
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
          {/* Campaign name and description (always visible) */}
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter campaign name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter campaign description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Navigation tabs */}
          <CampaignCreatorTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />

          {/* Tab content */}
          {renderTabContent()}

          {/* Footer with action buttons */}
          <CampaignCreatorFooter
            isEditing={!!campaign}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
