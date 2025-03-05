
import React, { useState, useEffect } from 'react';
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
  defaultTab?: string;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onClose,
  onStatusChange,
  onEdit,
  defaultTab = 'overview'
}) => {
  const { contacts, templates, contactLists, messages } = useApp();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Set default tab based on campaign status or provided default
  useEffect(() => {
    if (campaign.status === 'completed' && !defaultTab) {
      setActiveTab('analytics');
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [campaign.status, defaultTab]);
  
  // Get campaign-specific messages for analytics
  const campaignMessages = messages.filter(m => m.campaignId === campaign.id);
  
  // Generate analytics data - we explicitly set shouldUseDemoData to true for completed campaigns
  const shouldUseDemoData = campaign.status === 'completed';
  
  // Generate analytics data with demo mode if needed
  const timeOfDayData = generateTimeOfDayData(campaignMessages, shouldUseDemoData);
  const dayOfWeekData = generateDayOfWeekData(campaignMessages, shouldUseDemoData);
  const sentimentData = generateSentimentData(campaignMessages, shouldUseDemoData);
  const sentimentOverTimeData = generateSentimentOverTimeData(campaignMessages, shouldUseDemoData);
  const messageActivityData = generateMessageActivityData(campaignMessages, shouldUseDemoData);
  const positiveSentimentPercentage = calculatePositiveSentimentPercentage(campaignMessages, shouldUseDemoData);
  
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
                responseRate={campaign.responseRate || 0}
                isCompleted={campaign.status === 'completed'}
                campaignName={campaign.name}
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
