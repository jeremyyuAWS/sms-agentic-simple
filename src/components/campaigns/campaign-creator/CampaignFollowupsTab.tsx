
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

          <div className="border rounded-lg p-4 mb-4 bg-blue-50 text-blue-800">
            <h3 className="font-semibold mb-2">Follow-up Trigger Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-start gap-2">
                <div className="bg-white rounded-full p-1 mt-0.5">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Negative Response</p>
                  <p className="text-xs text-blue-700">When contacts express objections or decline</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-white rounded-full p-1 mt-0.5">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Positive Response</p>
                  <p className="text-xs text-blue-700">When contacts express interest or agree</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-white rounded-full p-1 mt-0.5">
                  <Search className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Keyword Response</p>
                  <p className="text-xs text-blue-700">When contacts mention specific keywords</p>
                </div>
              </div>
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
