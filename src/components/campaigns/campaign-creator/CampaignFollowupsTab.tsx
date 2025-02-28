
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import FollowUpFlowBuilder from '../FollowUpFlowBuilder';
import { Template, KnowledgeBase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';
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
            condition: 'no-response'
          },
          {
            id: `followup-${Date.now()}-2`,
            templateId: templates.length > 1 ? templates[1].id : selectedTemplateId,
            delayDays: 7,
            enabled: true,
            condition: 'no-response'
          }
        ];
        
        onFollowUpsChange(newFollowUps);
        
        toast({
          title: "Follow-up sequence generated",
          description: `Created 2 follow-up messages based on "${selectedKnowledgeBase.title}"`,
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
            Automatically send follow-up messages to contacts who haven't responded.
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
              <div className="text-sm">
                Using knowledge base: <span className="font-medium">{selectedKnowledgeBase.title}</span>
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
                      Generate a recommended follow-up sequence based on your knowledge base content
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
