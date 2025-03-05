
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MessageOptimizer from './ai-features/MessageOptimizer';
import FollowUpSuggestions from './ai-features/FollowUpSuggestions';
import CampaignInsights from './ai-features/CampaignInsights';
import { Sparkles, MessageSquare, BarChart3, Zap } from 'lucide-react';

interface CampaignAIFeaturesProps {
  campaign: any;
  onUpdateCampaign: (updates: any) => void;
}

const CampaignAIFeatures: React.FC<CampaignAIFeaturesProps> = ({
  campaign,
  onUpdateCampaign
}) => {
  // Handle when user selects an optimized message
  const handleOptimizedMessageSelect = (message: string) => {
    // Here you would update the campaign's message template
    onUpdateCampaign({
      // Add optimized message to the campaign
      optimizedMessage: message
    });
  };
  
  // Handle when user selects a follow-up suggestion
  const handleFollowUpSelect = (message: string, delayDays: number) => {
    // Here you would add a new follow-up to the campaign
    const newFollowUp = {
      id: `followup-${Date.now()}`,
      message,
      delayDays,
      enabled: true,
      name: `AI-Generated Follow-up (${delayDays} days)`,
      conditions: [{ type: 'no-response' }]
    };
    
    onUpdateCampaign({
      followUps: [...(campaign.followUps || []), newFollowUp]
    });
  };
  
  // Get messages from the campaign for the AI to analyze
  const getMessagesForAI = () => {
    // Start with the initial message
    const messages = [{
      id: 'initial',
      type: 'outbound',
      content: campaign.message || '',
      // Add other message properties as needed
    }];
    
    // Add follow-up messages
    if (campaign.followUps) {
      campaign.followUps.forEach((followUp: any) => {
        messages.push({
          id: followUp.id,
          type: 'outbound',
          content: followUp.message || '',
          // Add other message properties as needed
        });
      });
    }
    
    return messages;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
        <h2 className="text-xl font-bold">AI-Powered Features</h2>
      </div>
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle>Enhance Your Campaign with AI</CardTitle>
          <CardDescription>
            Use artificial intelligence to optimize your messages, generate smart follow-ups, and gain insights into campaign performance.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="optimize" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="optimize" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Optimize Messages
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Smart Follow-ups
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Campaign Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="optimize" className="pt-2">
              <MessageOptimizer
                initialMessage={campaign.message || "Hey there! I wanted to reach out about our services."}
                onSelectOptimized={handleOptimizedMessageSelect}
                audience={campaign.audience}
              />
            </TabsContent>
            
            <TabsContent value="suggestions" className="pt-2">
              <FollowUpSuggestions
                previousMessages={getMessagesForAI()}
                campaignContext={campaign}
                onSelectSuggestion={handleFollowUpSelect}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="pt-2">
              <CampaignInsights
                campaignData={campaign}
                onApplyOptimization={(optimization) => onUpdateCampaign(optimization)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAIFeatures;
