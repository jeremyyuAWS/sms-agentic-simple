
import React, { useState, useEffect } from 'react';
import { FollowUpCondition, Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, CheckCircle, X, Lightbulb, ListOrdered } from 'lucide-react';

// Import our components and hooks
import FollowUpList from './follow-ups/components/FollowUpList';
import IntroductionSection from './follow-ups/components/IntroductionSection';
import SequenceSummary from './follow-ups/SequenceSummary';
import ApprovalSection from './follow-ups/ApprovalSection';
import { useFollowUpManagement } from './follow-ups/useFollowUpManagement';
import { useFollowUpConfiguration } from '@/hooks/campaign-type/useFollowUpConfiguration';

interface CampaignFollowupsTabProps {
  isFollowUpsEnabled: boolean;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  followUps: any[];
  selectedTemplateId: string;
  templates: Template[];
  onFollowUpsChange: (followUps: any[]) => void;
  knowledgeBaseId?: string;
  knowledgeBases?: any[];
  onComplete?: () => void;
  campaignType?: string;
}

// New AI sequence suggestion component
const AISequenceSuggestions = ({ 
  campaignType,
  onApplySuggestion
}: { 
  campaignType: string,
  onApplySuggestion: (suggestion: any[]) => void
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  // Generate AI sequence suggestions based on campaign type
  const generateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Different suggested sequences based on campaign type
      let suggestion;
      
      switch(campaignType) {
        case 'event-invitation':
          suggestion = {
            title: "Event Invitation Sequence",
            description: "An optimized 4-message sequence for event invitations with 73% average response rate",
            messages: [
              { 
                name: "Initial Invitation", 
                delayDays: 0,
                message: "Hi {{first_name}}, I'd like to invite you to our exclusive {{event_name}} on {{event_date}}. This event brings together leaders from {{industry}} to discuss {{topic}}. Would you be interested in attending?"
              },
              { 
                name: "Value Proposition Follow-up", 
                delayDays: 3,
                message: "Hi {{first_name}}, just checking if you saw my invitation to {{event_name}}. Previous attendees from companies like {{similar_company}} found great value in the networking and insights. Can I reserve your spot?"
              },
              { 
                name: "Speaker Highlight", 
                delayDays: 4,
                message: "{{first_name}}, I wanted to mention that {{speaker_name}} from {{speaker_company}} will be presenting on {{presentation_topic}} at our event. Given your interest in this area, I thought you'd want to know. We still have a few spots left."
              },
              { 
                name: "Final Reminder", 
                delayDays: 2,
                message: "Hi {{first_name}}, just a final reminder that registration for {{event_name}} closes tomorrow. Let me know if you'd like to attend and I'll make sure you're added to the guest list."
              }
            ]
          };
          break;
          
        case 'sales-outreach':
          suggestion = {
            title: "AIDA Sales Sequence",
            description: "A 4-message sequence following the Attention, Interest, Desire, Action framework",
            messages: [
              { 
                name: "Attention Grabber", 
                delayDays: 0,
                message: "Hi {{first_name}}, did you know that companies in {{industry}} are experiencing a {{percentage}}% increase in {{metric}} by implementing {{solution_type}}? I'd love to show you how {{company}} might achieve similar results."
              },
              { 
                name: "Interest Builder", 
                delayDays: 3,
                message: "{{first_name}}, I wanted to follow up on my previous message. Our solution has specifically helped {{competitor_company}} overcome {{specific_challenge}} which I noticed {{company}} might also be facing based on your recent {{company_initiative}}."
              },
              { 
                name: "Desire Creator", 
                delayDays: 4,
                message: "Hi {{first_name}}, I thought you might be interested in this case study showing how we helped a {{industry}} company increase their {{metric}} by {{percentage}}% in just {{timeframe}}. Would you like to see if we could achieve similar results for {{company}}?"
              },
              { 
                name: "Action Prompt", 
                delayDays: 3,
                message: "{{first_name}}, based on our analysis, {{company}} could potentially {{specific_benefit}} by implementing our solution. I have a few openings this week for a quick 15-minute demo. Would Tuesday at 10am or Thursday at a 2pm work better for you?"
              }
            ]
          };
          break;
          
        default:
          suggestion = {
            title: "Standard Outreach Sequence",
            description: "A proven 3-message sequence with high engagement rates",
            messages: [
              { 
                name: "Introduction", 
                delayDays: 0,
                message: "Hi {{first_name}}, I'm {{sender_name}} from {{company}}. We help businesses like {{prospect_company}} to {{value_proposition}}. I'd love to share how we might be able to help you achieve {{specific_goal}}."
              },
              { 
                name: "Value Follow-up", 
                delayDays: 3,
                message: "{{first_name}}, I wanted to follow up on my previous message. Our clients typically see {{specific_benefit}} within {{timeframe}}. Would you be interested in learning how we could achieve similar results for {{prospect_company}}?"
              },
              { 
                name: "Final Check-in", 
                delayDays: 4,
                message: "Hi {{first_name}}, I'm reaching out one final time. If improving {{metric}} is a priority for {{prospect_company}}, I'd be happy to share some specific ideas based on what's worked for similar companies in {{industry}}. Let me know if you'd like to connect."
              }
            ]
          };
      }
      
      setSuggestions(suggestion);
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <Card className="border border-dashed border-blue-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center text-blue-600">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          AI Sequence Recommendations
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">BETA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!suggestions ? (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm">
                  Let AI analyze your campaign type and audience to generate an optimized message sequence based on industry best practices and performance data.
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Personalized follow-up timings</span>
                  </li>
                  <li className="text-sm flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Message content optimized for engagement</span>
                  </li>
                  <li className="text-sm flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Proven sequence structures for your specific campaign type</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={generateSuggestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Optimal Sequence...
                </span>
              ) : (
                <span className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate AI Sequence Recommendation
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{suggestions.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestions.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSuggestions(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {suggestions.messages.map((msg: any, idx: number) => (
                <div key={idx} className="border rounded-md p-3 bg-blue-50/50">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <span>{msg.name}</span>
                      {idx > 0 && (
                        <span className="text-xs text-blue-600 font-normal">
                          (+ {msg.delayDays} days)
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-xs mt-1 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-2"
              onClick={() => {
                onApplySuggestion(suggestions.messages);
                toast({
                  title: "AI Sequence Applied",
                  description: "The recommended message sequence has been applied to your campaign"
                });
                setSuggestions(null);
              }}
            >
              Apply This Sequence
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  onFollowUpsChange,
  onComplete,
  campaignType = 'event-invitation'
}) => {
  const { toast } = useToast();
  const [approved, setApproved] = useState(false);
  const { getDefaultFollowUps } = useFollowUpConfiguration();

  // Use our custom hooks
  const { updateFollowUp, getMessageTitle } = useFollowUpManagement(followUps, onFollowUpsChange);

  // Generate follow-ups if none exist
  useEffect(() => {
    if (followUps.length === 0 && selectedTemplateId) {
      // Create a default initial message (always required)
      const initialMessage = {
        id: `followup-${Date.now()}-1`,
        templateId: selectedTemplateId,
        delayDays: 0, // Initial message has no delay
        enabled: true,
        condition: 'no-response',
        name: 'Initial Message',
        conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
      };
      
      // If campaign type is provided, get recommended sequence
      if (campaignType && campaignType !== 'event-invitation') {
        // Get default follow-ups for this campaign type
        const defaultSequence = getDefaultFollowUps(campaignType as any, selectedTemplateId);
        if (defaultSequence.length > 0) {
          onFollowUpsChange([initialMessage, ...defaultSequence.slice(1)]);
          return;
        }
      }
      
      // Fallback to just the initial message
      onFollowUpsChange([initialMessage]);
    }
  }, [followUps.length, selectedTemplateId, campaignType, onFollowUpsChange, getDefaultFollowUps]);

  // Call onComplete when approved changes
  useEffect(() => {
    if (approved && onComplete) {
      onComplete();
    }
  }, [approved, onComplete]);

  const handleApproveSequence = () => {
    setApproved(true);
    toast({
      title: "Follow-up Sequence Approved",
      description: "Your message sequence has been approved. You can now complete the campaign setup.",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleAddFollowUp = () => {
    const newFollowUp = {
      id: `followup-${Date.now()}-${followUps.length + 1}`,
      templateId: selectedTemplateId || '', 
      delayDays: followUps.length > 0 ? 3 : 0, // Default to 3 days for follow-ups
      enabled: true,
      name: `Follow-up #${followUps.length}`,
      conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
    };
    
    onFollowUpsChange([...followUps, newFollowUp]);
  };

  const handleApplyAISequence = (messages: any[]) => {
    // Create new follow-ups with the AI-suggested messages
    const newFollowUps = messages.map((msg, index) => ({
      id: `followup-${Date.now()}-${index + 1}`,
      templateId: selectedTemplateId || '',
      delayDays: msg.delayDays || 0,
      enabled: true,
      name: msg.name,
      message: msg.message,
      conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
    }));
    
    onFollowUpsChange(newFollowUps);
  };

  return (
    <div className="space-y-4">
      <IntroductionSection />

      {/* AI Sequence Recommendations */}
      <AISequenceSuggestions 
        campaignType={campaignType}
        onApplySuggestion={handleApplyAISequence}
      />

      {/* Message Sequence Builder */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Message Sequence</h3>
          <Button 
            variant="outline" 
            onClick={handleAddFollowUp}
            size="sm"
          >
            Add Message
          </Button>
        </div>
        
        <FollowUpList
          followUps={followUps}
          selectedTemplateId={selectedTemplateId}
          getMessageTitle={getMessageTitle}
          updateFollowUp={updateFollowUp}
          onAddFollowUp={handleAddFollowUp}
          campaignType={campaignType}
        />
      </div>

      {/* Sequence Overview */}
      <SequenceSummary 
        followUps={followUps}
        getMessageTitle={getMessageTitle}
      />

      {/* Approval and Completion Section */}
      <ApprovalSection 
        approved={approved}
        handleApproveSequence={handleApproveSequence}
      />
    </div>
  );
};

export default CampaignFollowupsTab;
