
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template, FollowUpCondition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, MessageSquare, Clock, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

  // Find first template if none selected
  const initialTemplate = selectedTemplateId 
    ? templates.find(t => t.id === selectedTemplateId) 
    : templates[0];

  // Helper to get template preview
  const getTemplatePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.body : "No template selected";
  };

  // Generate follow-ups if none exist
  useEffect(() => {
    if (followUps.length === 0 && templates.length > 0) {
      // Create default follow-up sequence with first two templates
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
      
      // Only add second follow-up if we have more than one template
      if (templates.length > 1) {
        defaultFollowUps.push({
          id: `followup-${Date.now()}-2`,
          templateId: templates[1].id,
          delayDays: 7,
          enabled: true,
          condition: 'no-response',
          conditions: [
            { type: 'no-response' as FollowUpCondition['type'] },
            { type: 'negative-response' as FollowUpCondition['type'] }
          ]
        });
      }
      
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

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2 mt-2 mb-4">
        <p className="font-medium">Your Message Sequence</p>
        <p>This campaign includes a strategic messaging sequence designed to maximize engagement. You can customize each message or timing while maintaining proven communication patterns.</p>
      </div>

      <Tabs defaultValue="visual" className="mb-4" onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Sequence</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Builder</TabsTrigger>
        </TabsList>
        <TabsContent value="visual" className="mt-4">
          <div className="border rounded-lg p-4">
            <div className="space-y-6">
              {/* Initial message */}
              <div className="relative">
                <Card className="border-2 border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Initial Message
                    </CardTitle>
                    <CardDescription>
                      Sent immediately when campaign starts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="bg-muted/40 rounded-md p-3 text-sm">
                      {getTemplatePreview(selectedTemplateId || templates[0]?.id || "")}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center">
                    <span>Template: {initialTemplate?.name || "None selected"}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        toast({
                          title: "Template Preview",
                          description: "View and edit templates from the Templates page",
                        });
                      }}
                    >
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Visual connector */}
                {followUps.length > 0 && (
                  <div className="absolute h-8 w-0.5 bg-border left-1/2 -bottom-8 transform -translate-x-1/2"></div>
                )}
              </div>
              
              {/* Follow-up messages */}
              {followUps.map((followUp, index) => {
                const template = templates.find(t => t.id === followUp.templateId);
                const conditions = followUp.conditions || 
                  (followUp.condition === 'no-response' ? [{ type: 'no-response' as FollowUpCondition['type'] }] : 
                   followUp.condition === 'all' ? [{ type: 'all' as FollowUpCondition['type'] }] : []);
                
                const hasNextFollowUp = index < followUps.length - 1;
                
                return (
                  <div key={followUp.id} className="relative">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Follow-up {index + 1}: After {followUp.delayDays} days
                        </CardTitle>
                        <CardDescription>
                          {conditions.map((condition, i) => (
                            <span key={i} className="inline-flex items-center mr-2">
                              {condition.type === 'no-response' && "If no response"}
                              {condition.type === 'negative-response' && "If negative response"}
                              {condition.type === 'positive-response' && "If positive response"}
                              {condition.type === 'all' && "Always send"}
                              {condition.type === 'keyword' && "If keyword detected"}
                              {i < conditions.length - 1 && " or "}
                            </span>
                          ))}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="bg-muted/40 rounded-md p-3 text-sm">
                          {getTemplatePreview(followUp.templateId)}
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="flex items-center gap-1">
                            <Label htmlFor={`enabled-${followUp.id}`} className="text-xs">Enabled</Label>
                            <Switch
                              id={`enabled-${followUp.id}`}
                              checked={followUp.enabled}
                              onCheckedChange={(checked) => {
                                const updatedFollowUps = [...followUps];
                                updatedFollowUps[index].enabled = checked;
                                onFollowUpsChange(updatedFollowUps);
                              }}
                              className="scale-75 origin-left"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-2"
                            onClick={() => {
                              const updatedFollowUps = followUps.filter((_, i) => i !== index);
                              onFollowUpsChange(updatedFollowUps);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center">
                        <span>Template: {template?.name || "None selected"}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            toast({
                              title: "Template Preview",
                              description: "View and edit templates from the Templates page",
                            });
                          }}
                        >
                          Preview
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Visual connector for next follow-up */}
                    {hasNextFollowUp && (
                      <div className="absolute h-8 w-0.5 bg-border left-1/2 -bottom-8 transform -translate-x-1/2"></div>
                    )}
                  </div>
                );
              })}
              
              {/* Add new follow-up button */}
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
                Add Another Follow-up Message
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
                Approve Messages
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
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Message sequence approved! You can now complete the campaign setup.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignFollowupsTab;
