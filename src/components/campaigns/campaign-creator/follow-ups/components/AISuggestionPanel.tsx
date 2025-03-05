
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Wand, MessageSquareHeart, CheckCircle, RefreshCw, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AISuggestionPanelProps {
  campaignType: string;
  onSuggestionSelect: (suggestion: string) => void;
}

const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({ 
  campaignType, 
  onSuggestionSelect 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiMode, setAiMode] = useState<'standard' | 'advanced'>('standard');
  
  // Enhanced AI suggestions based on campaign type
  const getSuggestionsByType = (type: string, mode: 'standard' | 'advanced'): string[] => {
    if (mode === 'advanced') {
      switch(type) {
        case 'event-invitation':
          return [
            "Hi {{first_name}}, looking at {{company}}'s recent focus on {{industry_trend}}, I thought you'd be interested in our exclusive event where leaders from {{competitor_companies}} will be discussing solutions to these exact challenges. Would you like the details?",
            "{{first_name}}, I noticed you recently published about {{recent_topic}}. Our upcoming event features experts addressing this specific issue, with actionable strategies that have helped companies like {{similar_company}} improve their {{metric}} by {{percentage}}. Can I share more?",
            "Based on your role at {{company}} and your team's focus on {{business_goal}}, I believe our upcoming invite-only event would be valuable for you. Previous attendees in similar roles have implemented takeaways resulting in {{specific_benefit}}. Would next Tuesday work to discuss?"
          ];
        case 'sales-outreach':
          return [
            "{{first_name}}, after analyzing {{company}}'s recent {{company_news}}, I can see you're facing challenges with {{specific_pain_point}}. We've helped {{competitor_1}}, {{competitor_2}}, and {{competitor_3}} overcome this exact issue by {{specific_solution}}. Would you be open to seeing how?",
            "Hi {{first_name}}, I've studied {{company}}'s approach to {{business_area}} and noticed an opportunity to improve {{metric}} by {{percentage}}. Our solution addresses the {{specific_challenge}} that your recent {{company_initiative}} appears to be targeting. Could I show you a 3-minute demo?",
            "{{first_name}}, I've researched {{company}}'s {{product_line}} and see that you might be experiencing {{industry_challenge}} like 83% of other {{industry}} leaders we've surveyed. We've developed a unique approach that has helped similar companies increase {{key_metric}} by {{percentage}}. When would be a good time to discuss?"
          ];
        case 'follow-up-reminder':
          return [
            "{{first_name}}, since our last conversation about {{previous_topic}}, we've developed a new {{feature_name}} that specifically addresses the {{pain_point}} you mentioned. Companies similar to {{company}} are seeing {{specific_result}} within just {{timeframe}}. Would this be worth exploring?",
            "Hi {{first_name}}, following up on {{previous_context}}. I've put together a custom analysis of how {{company}} could improve {{metric}} based on what we've learned from {{similar_company_1}} and {{similar_company_2}}. The potential impact to your {{department}} is significant. When would be a good time to review this together?",
            "I wanted to circle back, {{first_name}}. After our discussion about {{topic}}, I spoke with our {{expert_role}} who has worked with {{relevant_company}} on a similar challenge. They suggested a different approach that resulted in {{specific_outcome}}. I'd love to share these insights - do you have 15 minutes this week?"
          ];
        default:
          return [
            "{{first_name}}, based on your profile at {{company}} and your expertise in {{professional_area}}, I believe our {{solution_name}} could help you achieve {{specific_goal}}. We've helped similar {{position_title}}s at {{competitor_1}} and {{competitor_2}} increase their {{key_metric}} by {{percentage}}. Would you be interested in learning how?",
            "Hi {{first_name}}, I noticed {{company}}'s recent announcement about {{company_initiative}}. Our platform has specifically helped companies during similar transitions by {{specific_benefit}}, reducing {{pain_point}} by {{percentage}}. Would you be open to a brief call to explore if we could help {{company}} as well?",
            "{{first_name}}, after analyzing {{industry}} trends and {{company}}'s position in the market, I see an opportunity for you to gain advantage in {{competitive_area}}. Our solution has helped {{similar_company}} achieve {{specific_result}} in just {{timeframe}}. When would be a good time to discuss how this might work for {{company}}?"
          ];
      }
    } else {
      // Standard mode suggestions (same as original)
      switch(type) {
        case 'event-invitation':
          return [
            "Hi {{first_name}}, we're hosting an exclusive industry event on {{event_date}} featuring speakers from {{companies}}. Would you like to join us?",
            "{{first_name}}, based on your interest in {{topic}}, I'd like to invite you to our upcoming event. Can I share the details?",
            "Hello {{first_name}}! Given your role at {{company}}, I think you'd benefit from our upcoming {{event_name}}. Would you like more information?"
          ];
        case 'sales-outreach':
          return [
            "Hi {{first_name}}, I noticed {{company}} is expanding its {{department}}. Our solution has helped similar businesses improve {{metric}} by {{percentage}}. Worth a quick chat?",
            "{{first_name}}, I've researched {{company}} and see you're facing {{challenge}}. We've helped companies like {{competitor}} overcome this with our {{solution}}. Can I share how?",
            "Based on your recent {{activity}}, {{first_name}}, I think our {{product_name}} could help your team achieve {{goal}}. Would you be open to a 15-minute demo?"
          ];
        case 'follow-up-reminder':
          return [
            "Just following up on my previous message, {{first_name}}. I'm still interested in discussing how we can help with {{pain_point}}. Does this week work better?",
            "{{first_name}}, I wanted to circle back about {{topic}} that I mentioned previously. Have you had a chance to consider it?",
            "Hi {{first_name}}, I know you're busy, but I wanted to check if you've had time to review the {{document}} I sent over. Any questions I can answer?"
          ];
        default:
          return [
            "Hi {{first_name}}, I'd love to connect about {{topic}} and explore how we might work together.",
            "{{first_name}}, based on your work at {{company}}, I think our {{solution}} would be valuable for your team.",
            "Hello {{first_name}}! I've been following {{company}}'s progress and believe we could help with {{goal}}. Would you have 15 minutes to discuss?"
          ];
      }
    }
  };
  
  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newSuggestions = getSuggestionsByType(campaignType, aiMode);
      setSuggestions(newSuggestions);
      setIsLoading(false);
      
      toast({
        title: `AI Suggestions Generated (${aiMode === 'advanced' ? 'Advanced' : 'Standard'} Mode)`,
        description: "Based on your campaign type, audience data, and industry benchmarks",
      });
    }, 1500);
  };

  const toggleAIMode = () => {
    const newMode = aiMode === 'standard' ? 'advanced' : 'standard';
    setAiMode(newMode);
    setSuggestions([]);
  };
  
  return (
    <Card className="mt-4 border-dashed border-purple-200">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center text-purple-700">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            AI Message Suggestions
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAIMode}
            className={`text-xs ${aiMode === 'advanced' ? 'bg-purple-100 text-purple-700' : ''}`}
          >
            {aiMode === 'advanced' ? (
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                <span>Advanced Mode</span>
              </div>
            ) : 'Enable Advanced AI'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {aiMode === 'advanced' 
                ? 'Generate highly personalized, research-based message suggestions tailored to your campaign type, audience data, and industry benchmarks.'
                : 'Generate AI-powered message suggestions tailored to your campaign type and audience.'}
            </p>
            <Button 
              onClick={handleGenerateSuggestions} 
              className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {aiMode === 'advanced' ? 'Analyzing Data & Generating Suggestions...' : 'Generating Suggestions...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  {aiMode === 'advanced' ? 'Generate Advanced AI Suggestions' : 'Generate Message Suggestions'}
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {aiMode === 'advanced' 
                ? 'These advanced suggestions incorporate industry research, competitor analysis, and personalization based on recipient data.'
                : 'Select any suggestion to use it as your message. Each is tailored based on your campaign type.'}
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`p-3 border rounded-md text-sm hover:bg-purple-50 cursor-pointer transition-all ${aiMode === 'advanced' ? 'bg-purple-50/50 border-purple-100' : ''}`}
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  <p>{suggestion}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {aiMode === 'advanced' ? 'Advanced AI suggestion' : 'AI suggestion'} #{index + 1}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSuggestionSelect(suggestion);
                        toast({
                          title: "Message Applied",
                          description: "AI-generated message has been added to your campaign"
                        });
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateSuggestions}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
              
              <Button
                variant={aiMode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleAIMode}
                className={`text-xs ${aiMode === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              >
                {aiMode === 'advanced' ? (
                  <span className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    <span>Using Advanced AI</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    <span>Try Advanced AI</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestionPanel;
