
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign } from '@/lib/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our component files
import { CampaignHeader } from './detail/CampaignHeader';
import { CampaignOverviewTab } from './detail/CampaignOverviewTab';
import { AnalyticsTab } from './detail/AnalyticsTab';
import { ContactsTab } from './detail/ContactsTab';
import { FollowUpsTab } from './detail/FollowUpsTab';
import {
  generateTimeOfDayData,
  generateDayOfWeekData,
  generateSentimentData,
  generateSentimentOverTimeData,
  generateMessageActivityData,
  calculatePositiveSentimentPercentage
} from './detail/analyticsUtils';

interface CampaignDetailViewProps {
  campaign: Campaign;
  onClose: () => void;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
  onEdit: (campaignId: string) => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onClose,
  onStatusChange,
  onEdit
}) => {
  const { contacts, templates, contactLists, messages } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get campaign-specific messages for analytics
  const campaignMessages = messages.filter(m => m.campaignId === campaign.id);
  
  // Generate analytics data
  const timeOfDayData = generateTimeOfDayData(campaignMessages);
  const dayOfWeekData = generateDayOfWeekData(campaignMessages);
  const sentimentData = generateSentimentData(campaignMessages);
  const sentimentOverTimeData = generateSentimentOverTimeData(campaignMessages);
  const messageActivityData = generateMessageActivityData(campaignMessages);
  const positiveSentimentPercentage = calculatePositiveSentimentPercentage(campaignMessages);
  
  const getTemplate = () => {
    if (!campaign.templateId) return 'No template selected';
    const template = templates.find(t => t.id === campaign.templateId);
    return template ? template.name : 'Unknown template';
  };
  
  const getContacts = () => {
    if (campaign.contactIds && campaign.contactIds.length > 0) {
      return `${campaign.contactIds.length} individual contacts`;
    } else if (campaign.contactListId) {
      const list = contactLists.find(l => l.id === campaign.contactListId);
      return list ? `List: ${list.name} (${list.contactIds.length} contacts)` : 'Unknown list';
    } else if (campaign.segmentId) {
      return `Segment: ${campaign.segmentId}`;
    }
    return 'No contacts selected';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CampaignHeader 
            campaign={campaign} 
            onStatusChange={onStatusChange} 
            onEdit={onEdit} 
          />
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <CampaignOverviewTab 
                campaign={campaign}
                getTemplate={getTemplate}
                getContacts={getContacts}
                onStatusChange={onStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsTab 
                campaignMessages={campaignMessages}
                responseRate={campaign.responseRate}
                timeOfDayData={timeOfDayData}
                dayOfWeekData={dayOfWeekData}
                sentimentData={sentimentData}
                sentimentOverTimeData={sentimentOverTimeData}
                messageActivityData={messageActivityData}
                positiveSentimentPercentage={positiveSentimentPercentage}
              />
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactsTab contactsInfo={getContacts()} />
            </TabsContent>
            
            <TabsContent value="followups">
              <FollowUpsTab campaign={campaign} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" onClick={onClose}>
            Back to Campaigns
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CampaignDetailView;
