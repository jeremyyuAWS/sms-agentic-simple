
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template, FollowUpCondition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, MessageSquare, Clock, Calendar, ArrowRight, CheckCircle, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import RecommendedTemplatesList from '../RecommendedTemplatesList';
import { CampaignType } from '../CampaignTypeSelector';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
}

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  templates,
  onFollowUpsChange,
  onComplete,
}) => {
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<string>("visual");
  const [approved, setApproved] = useState(false);
  const [campaignType, setCampaignType] = useState<CampaignType>("event-invitation");

  // Generate follow-ups if none exist
  useEffect(() => {
    if (followUps.length === 0 && templates.length > 0) {
      // Create default follow-up sequence with first template
      const defaultFollowUps = [
        {
          id: `followup-${Date.now()}-1`,
          templateId: selectedTemplateId || templates[0]?.id,
          delayDays: 3,
          enabled: true,
          condition: 'no-response',
          conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
        }
      ];
      
      onFollowUpsChange(defaultFollowUps);
    }
  }, [followUps.length, templates, selectedTemplateId, onFollowUpsChange]);

  const handleApproveSequence = () => {
    setApproved(true);
    toast({
      title: "Follow-up Sequence Approved",
      description: "Your message sequence has been approved. You can now complete the campaign setup.",
    });
  };

  const handleCompleteSetup = () => {
    if (onComplete) {
      onComplete();
    }
  };

  // Function to move a follow-up message up in the sequence
  const moveFollowUpUp = (index: number) => {
    if (index <= 0) return; // Can't move the first item up
    
    const newFollowUps = [...followUps];
    const temp = newFollowUps[index];
    newFollowUps[index] = newFollowUps[index - 1];
    newFollowUps[index - 1] = temp;
    
    // Adjust delay days to maintain relative spacing
    const currentDelay = newFollowUps[index].delayDays;
    const prevDelay = newFollowUps[index - 1].delayDays;
    newFollowUps[index].delayDays = prevDelay;
    newFollowUps[index - 1].delayDays = currentDelay;
    
    onFollowUpsChange(newFollowUps);
    
    toast({
      title: "Message Reordered",
      description: "Message moved up in the sequence.",
    });
  };

  // Function to move a follow-up message down in the sequence
  const moveFollowUpDown = (index: number) => {
    if (index >= followUps.length - 1) return; // Can't move the last item down
    
    const newFollowUps = [...followUps];
    const temp = newFollowUps[index];
    newFollowUps[index] = newFollowUps[index + 1];
    newFollowUps[index + 1] = temp;
    
    // Adjust delay days to maintain relative spacing
    const currentDelay = newFollowUps[index].delayDays;
    const nextDelay = newFollowUps[index + 1].delayDays;
    newFollowUps[index].delayDays = nextDelay;
    newFollowUps[index + 1].delayDays = currentDelay;
    
    onFollowUpsChange(newFollowUps);
    
    toast({
      title: "Message Reordered",
      description: "Message moved down in the sequence.",
    });
  };

  // Function to handle template selection from the RecommendedTemplatesList
  const handleTemplateSelect = (templateId: string) => {
    // If this is the initial template selection, update the first follow-up
    if (followUps.length > 0) {
      const newFollowUps = [...followUps];
      newFollowUps[0] = {
        ...newFollowUps[0],
        templateId
      };
      onFollowUpsChange(newFollowUps);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2 mt-2 mb-4">
        <p className="font-medium">Your Message Sequence</p>
        <p>This campaign includes a strategic messaging sequence designed to maximize engagement. You can customize each message or timing while maintaining proven communication patterns.</p>
      </div>

      {/* Add RecommendedTemplatesList at the top */}
      <div className="mb-6">
        <RecommendedTemplatesList
          campaignType={campaignType}
          templates={templates}
          onSelectTemplate={handleTemplateSelect}
          selectedTemplateId={followUps[0]?.templateId || selectedTemplateId}
        />
      </div>

      <Tabs defaultValue="visual" className="mb-4" onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Sequence</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Builder</TabsTrigger>
        </TabsList>
        <TabsContent value="visual" className="mt-4">
          <div className="border rounded-lg p-4">
            <div className="space-y-6">
              {/* Pre-defined message sequence */}
              {followUps.map((followUp, index) => (
                <div key={followUp.id} className="relative bg-slate-50 border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <h4 className="font-medium">
                        {index === 0 ? 'Initial Message' : `Follow-up #${index}`}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveFollowUpUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Move message up in sequence</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveFollowUpDown(index)}
                              disabled={index === followUps.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Move message down in sequence</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="mr-1 h-4 w-4" />
                      {index === 0 ? 
                        'Initial message sent immediately' : 
                        `Sent ${followUp.delayDays} days after initial message`}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {`Template: ${templates.find(t => t.id === followUp.templateId)?.name || 'Unknown template'}`}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add follow-up button */}
              <Button 
                variant="outline" 
                className="w-full mt-4 border-dashed"
                onClick={() => {
                  // Find a template not yet used, or reuse the first one
                  const usedTemplateIds = new Set(followUps.map(f => f.templateId));
                  let templateId = templates.find(t => !usedTemplateIds.has(t.id))?.id || templates[0]?.id;
                  
                  const newFollowUp = {
                    id: `followup-${Date.now()}-${followUps.length + 1}`,
                    templateId,
                    delayDays: followUps.length > 0 ? followUps[followUps.length - 1].delayDays + 4 : 3,
                    enabled: true,
                    conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
                  };
                  
                  onFollowUpsChange([...followUps, newFollowUp]);
                }}
              >
                Add Follow-up Message
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="mt-4">
          <FollowUpFlowBuilder
            initialTemplateId={selectedTemplateId || templates[0]?.id || ""}
            followUps={followUps}
            templates={templates}
            onUpdate={onFollowUpsChange}
          />
        </TabsContent>
      </Tabs>

      {/* Sequence Overview */}
      <div className="mt-6 bg-slate-50 border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ListOrdered className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Message Sequence Summary</h3>
        </div>
        <div className="pl-4 border-l-2 border-primary/20 space-y-2">
          {followUps.map((followUp, index) => (
            <div key={`summary-${followUp.id}`} className="flex items-center text-sm">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <span>
                {index === 0 ? 'Initial message' : 
                  `Follow-up ${index}: Sent after ${followUp.delayDays} days`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Approval and Completion Section */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Review and Approve</h3>
            <p className="text-sm text-muted-foreground">
              Review your message sequence before finalizing the campaign.
            </p>
          </div>
          <div className="flex gap-4">
            {!approved ? (
              <Button 
                onClick={handleApproveSequence}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Sequence
              </Button>
            ) : (
              <Button 
                onClick={handleCompleteSetup}
                className="bg-primary hover:bg-primary/90"
              >
                Complete Campaign Setup
              </Button>
            )}
          </div>
        </div>
        {approved && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Message sequence approved! You can now complete the campaign setup.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignFollowupsTab;
