
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, MessageSquare, MessageSquareDashed } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CampaignType } from './CampaignTypeSelector';

interface CampaignMessageEditorProps {
  campaignType: CampaignType | null;
  messageContent: string;
  followUpContent: string;
  onMessageChange: (content: string) => void;
  onFollowUpChange: (content: string) => void;
}

const CampaignMessageEditor: React.FC<CampaignMessageEditorProps> = ({
  campaignType,
  messageContent,
  followUpContent,
  onMessageChange,
  onFollowUpChange
}) => {
  // Define default templates based on campaign type
  const getDefaultTemplate = (type: CampaignType | null): string => {
    switch (type) {
      case 'event-invitation':
        return `Hi {{name}},\n\nI'd like to invite you to our upcoming event: [Event Name] on [Date] at [Time]. Would you be interested in attending?\n\nBest regards,\n[Your Name]`;
      
      case 'sales-outreach':
        return `Hello {{name}},\n\nI noticed you might be interested in [Product/Service]. Our solution helps [Brief Value Proposition]. Would you be open to a quick call to discuss how we could help?\n\nThanks,\n[Your Name]`;
      
      case 'follow-up-reminder':
        return `Hi {{name}},\n\nI wanted to follow up on our previous conversation about [Topic]. Have you had a chance to consider it?\n\nBest,\n[Your Name]`;
      
      case 'meeting-scheduling':
        return `Hello {{name}},\n\nI'd like to schedule a meeting to discuss [Topic]. Would you be available on [Proposed Date/Time]?\n\nRegards,\n[Your Name]`;
      
      case 'announcement':
        return `Hello {{name}},\n\nWe have an important announcement to share: [Announcement Details].\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your Name]`;
      
      default:
        return `Hello {{name}},\n\nType your message here.\n\nBest regards,\n[Your Name]`;
    }
  };
  
  const getDefaultFollowUp = (type: CampaignType | null): string => {
    switch (type) {
      case 'event-invitation':
        return `Hi {{name}},\n\nJust following up on my invitation to [Event Name]. Spots are filling up quickly, and I wanted to make sure you had the opportunity to join.\n\nLet me know if you're interested!\n\nBest regards,\n[Your Name]`;
      
      case 'sales-outreach':
        return `Hello {{name}},\n\nI'm reaching out again about [Product/Service]. I'd be happy to answer any questions you might have.\n\nWould you be available for a quick call this week?\n\nThanks,\n[Your Name]`;
      
      case 'follow-up-reminder':
        return `Hi {{name}},\n\nI'm checking in once more about [Topic]. Please let me know if you need any additional information or have any questions.\n\nBest,\n[Your Name]`;
      
      case 'meeting-scheduling':
        return `Hello {{name}},\n\nI wanted to follow up on my meeting request. If [Proposed Date/Time] doesn't work for you, I'm happy to suggest alternative times.\n\nRegards,\n[Your Name]`;
      
      case 'announcement':
        return `Hello {{name}},\n\nI wanted to make sure you saw our announcement about [Announcement Details].\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your Name]`;
      
      default:
        return `Hello {{name}},\n\nI'm following up on my previous message. Looking forward to hearing from you.\n\nBest regards,\n[Your Name]`;
    }
  };
  
  // Set default templates when campaign type changes
  useEffect(() => {
    if (campaignType && !messageContent) {
      onMessageChange(getDefaultTemplate(campaignType));
    }
    if (campaignType && !followUpContent) {
      onFollowUpChange(getDefaultFollowUp(campaignType));
    }
  }, [campaignType]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Customize Your Messages</h2>
        <p className="text-muted-foreground mt-2">
          Personalize your message templates for this campaign
        </p>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Personalization Tips</AlertTitle>
        <AlertDescription>
          Use <strong>{'{{name}}'}</strong> to insert the contact's name. 
          Replace placeholders like [Event Name] with your specific details.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="initial">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="initial">
            <MessageSquare className="mr-2 h-4 w-4" />
            Initial Message
          </TabsTrigger>
          <TabsTrigger value="followup">
            <MessageSquareDashed className="mr-2 h-4 w-4" />
            Follow-Up Message
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="initial" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="message" className="mb-2 block">Initial Outreach Message</Label>
              <Textarea
                id="message"
                value={messageContent}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Enter your message here..."
                className="min-h-[200px]"
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This message will be sent when the campaign begins.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followup" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="followup" className="mb-2 block">Follow-Up Message</Label>
              <Textarea
                id="followup"
                value={followUpContent}
                onChange={(e) => onFollowUpChange(e.target.value)}
                placeholder="Enter your follow-up message here..."
                className="min-h-[200px]"
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This follow-up will be sent if no response is received after the specified delay.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignMessageEditor;
