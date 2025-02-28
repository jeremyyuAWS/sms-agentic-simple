
import React, { useState, useEffect } from 'react';
// Remove uuid import as it's not installed and not needed
import { useApp } from '@/contexts';
import { 
  Campaign, 
  Contact, 
  ContactList, 
  Template, 
  KnowledgeBase, 
  TimeWindow 
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import CampaignContactSelection from './CampaignContactSelection';
import TemplateSelector from '@/components/templates/TemplateSelector';
import ScheduleCampaign from './ScheduleCampaign';
import FollowUpFlowBuilder from './FollowUpFlowBuilder';

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
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isFollowUpsEnabled, setIsFollowUpsEnabled] = useState<boolean>(campaign?.followUps && campaign.followUps.length > 0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplateId(template.id);
  };

  // Fix knowledgeBaseSelect to use onValueChange
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

  const handleFollowUpsChange = (followUps: any[]) => {
    setFollowUps(followUps);
  };

  const handleSubmit = () => {
    // Add required fields for Campaign type
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
      status: 'draft' as 'draft' | 'active' | 'paused' | 'completed', // Explicitly cast status
      updatedAt: now,
      contactCount: selectedContactIds.length || 0
    };

    if (campaign) {
      onUpdateCampaign(campaign.id, campaignData);
    } else {
      onCreateCampaign(campaignData);
    }
  };

  const knowledgeBaseOptions = knowledgeBases.map(kb => ({
    value: kb.id,
    label: kb.title
  }));

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

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{campaign ? 'Edit Campaign' : 'Create Campaign'}</CardTitle>
          <CardDescription>
            {campaign ? 'Update your campaign details here' : 'Define the details for your new campaign'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Tabs */}
          <div className="border-b">
            <nav className="-mb-0.5 flex space-x-6" aria-label="Tabs">
              <Button 
                variant={activeTab === 'details' ? 'default' : 'outline'}
                onClick={() => setActiveTab('details')}
              >
                Details
              </Button>
              <Button 
                variant={activeTab === 'contacts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('contacts')}
              >
                Contacts
              </Button>
              <Button 
                variant={activeTab === 'template' ? 'default' : 'outline'}
                onClick={() => setActiveTab('template')}
              >
                Template
              </Button>
              <Button 
                variant={activeTab === 'schedule' ? 'default' : 'outline'}
                onClick={() => setActiveTab('schedule')}
              >
                Schedule
              </Button>
              <Button 
                variant={activeTab === 'followups' ? 'default' : 'outline'}
                onClick={() => setActiveTab('followups')}
              >
                Follow-ups
              </Button>
            </nav>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="knowledgeBase">Knowledge Base (Optional)</Label>
                <Select 
                  value={knowledgeBaseId} 
                  onValueChange={handleKnowledgeBaseSelect}
                >
                  <SelectTrigger id="knowledgeBase">
                    <SelectValue placeholder="Select a knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeBaseOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <CampaignContactSelection
              selectedContactIds={selectedContactIds}
              contactListId={contactListId}
              segmentId={segmentId}
              onContactsSelect={handleContactsSelect}
              onListSelect={handleListSelect}
              onSegmentSelect={handleSegmentSelect}
            />
          )}

          {/* Template Tab */}
          {activeTab === 'template' && (
            <TemplateSelector onSelect={handleTemplateSelect} />
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <ScheduleCampaign
              startDate={scheduledStartDate}
              window={sendingWindow}
              timezone={timeZone}
              onScheduleChange={handleScheduleChange}
              onSendingWindowChange={handleSendingWindowChange}
              onTimeZoneChange={handleTimeZoneChange}
            />
          )}

          {/* Follow-ups Tab */}
          {activeTab === 'followups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="followups-enabled">Enable Follow-ups</Label>
                <Switch
                  id="followups-enabled"
                  checked={isFollowUpsEnabled}
                  onCheckedChange={setIsFollowUpsEnabled}
                />
              </div>
              {isFollowUpsEnabled && (
                <FollowUpFlowBuilder
                  initialTemplateId={selectedTemplateId || templates[0]?.id || ""}
                  followUps={followUps}
                  templates={templates}
                  onUpdate={handleFollowUpsChange}
                />
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
