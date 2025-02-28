
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template, KnowledgeBase, FollowUpCondition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, MessageSquare, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CampaignFollowupsTabProps {
  isFollowUpsEnabled: boolean;
  setIsFollowUpsEnabled: (enabled: boolean) => void;
  followUps: any[];
  selectedTemplateId: string;
  templates: Template[];
  onFollowUpsChange: (followUps: any[]) => void;
  knowledgeBaseId?: string;
  knowledgeBases?: KnowledgeBase[];
}

const CampaignFollowupsTab: React.FC<CampaignFollowupsTabProps> = ({
  isFollowUpsEnabled,
  setIsFollowUpsEnabled,
  followUps,
  selectedTemplateId,
  templates,
  onFollowUpsChange,
  knowledgeBaseId,
  knowledgeBases = []
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedKnowledgeBase = knowledgeBaseId 
    ? knowledgeBases.find(kb => kb.id === knowledgeBaseId) 
    : undefined;

  // Helper function to generate smart follow-ups based on knowledge base and initial template
  const generateSmartFollowUps = () => {
    setIsGenerating(true);
    
    // Simulation of AI-generated follow-ups (in a real app, this would use actual AI processing)
    setTimeout(() => {
      const initialTemplate = templates.find(t => t.id === selectedTemplateId);
      
      if (initialTemplate && selectedKnowledgeBase) {
        // Create follow-up recommendation based on the content and initial template
        const newFollowUps = [
          {
            id: `followup-${Date.now()}-1`,
            templateId: selectedTemplateId,
            delayDays: 3,
            enabled: true,
            condition: 'no-response',
            conditions: [{ type: 'no-response' as FollowUpCondition['type'] }]
          },
          {
            id: `followup-${Date.now()}-2`,
            templateId: templates.length > 1 ? templates[1].id : selectedTemplateId,
            delayDays: 7,
            enabled: true,
            condition: 'no-response',
            conditions: [
              { type: 'no-response' as FollowUpCondition['type'] },
              { type: 'negative-response' as FollowUpCondition['type'] }
            ]
          }
        ];
        
        onFollowUpsChange(newFollowUps);
        
        toast({
          title: "Follow-up sequence generated",
          description: `Created a smart follow-up sequence based on "${selectedKnowledgeBase.title}"`,
        });
      } else {
        toast({
          title: "Couldn't generate follow-ups",
          description: "Please select a valid template and knowledge base first",
          variant: "destructive"
        });
      }
      
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <div>
          <Label htmlFor="followups-enabled" className="text-base font-medium">Enable Follow-ups</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Automatically send follow-up messages triggered by various response types.
          </p>
        </div>
        <Switch
          id="followups-enabled"
          checked={isFollowUpsEnabled}
          onCheckedChange={setIsFollowUpsEnabled}
        />
      </div>
      
      {isFollowUpsEnabled && (
        <>
          {selectedKnowledgeBase && (
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Using knowledge base: <span className="font-medium">{selectedKnowledgeBase.title}</span></span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateSmartFollowUps}
                      disabled={isGenerating}
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isGenerating ? "Generating..." : "Generate Smart Sequence"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Generate a multi-stage follow-up sequence optimized for your knowledge base content
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {!selectedKnowledgeBase && (
            <div className="text-sm flex items-center gap-2 text-amber-600 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span>No knowledge base selected. Adding one improves follow-up suggestions.</span>
            </div>
          )}

          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Pre-configured Follow-up Sequence</h3>
            <p className="text-sm mb-3">
              Your campaign includes a strategic follow-up sequence designed to maximize engagement. Each step is fully customizable but optimized based on proven communication patterns:
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-primary font-medium">Step 1:</div>
                <div>
                  <p className="font-medium">Initial Outreach</p>
                  <p className="text-muted-foreground">Your primary message that introduces your offer or invitation.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-primary font-medium">Step 2:</div>
                <div>
                  <p className="font-medium">First Follow-up (3 days later)</p>
                  <p className="text-muted-foreground">Sent if no response is received. Gently reminds recipients about your initial message.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-primary font-medium">Step 3:</div>
                <div>
                  <p className="font-medium">Second Follow-up (7 days after initial)</p>
                  <p className="text-muted-foreground">Triggered by continued non-response or negative responses. Provides additional value or addresses common objections.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm">
                <span className="font-medium">Why this works:</span> Research shows that 80% of sales require 5+ follow-ups, yet 44% of salespeople give up after just one attempt. This sequence ensures you maintain contact through the critical decision-making window.
              </p>
            </div>
          </div>
          
          <FollowUpFlowBuilder
            initialTemplateId={selectedTemplateId || templates[0]?.id || ""}
            followUps={followUps}
            templates={templates}
            onUpdate={onFollowUpsChange}
            knowledgeBaseId={knowledgeBaseId}
            knowledgeBases={knowledgeBases}
          />
        </>
      )}
    </div>
  );
};

export default CampaignFollowupsTab;
