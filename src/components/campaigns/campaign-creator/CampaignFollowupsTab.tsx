
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template, FollowUpCondition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, MessageSquare, Clock, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
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
