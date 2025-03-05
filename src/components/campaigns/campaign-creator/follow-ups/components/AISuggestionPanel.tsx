
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Wand, MessageSquareHeart } from 'lucide-react';
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
  
  // Mock data for AI suggestions based on campaign type
  const getSuggestionsByType = (type: string): string[] => {
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
  };
  
  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newSuggestions = getSuggestionsByType(campaignType);
      setSuggestions(newSuggestions);
      setIsLoading(false);
      
      toast({
        title: "AI Suggestions Generated",
        description: "Based on your campaign type and audience data",
      });
    }, 1500);
  };
  
  return (
    <Card className="mt-4 border-dashed border-purple-200">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-md flex items-center text-purple-700">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          AI Message Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate AI-powered message suggestions tailored to your campaign type and audience.
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
                  Generating Suggestions...
                </span>
              ) : (
                <span className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Message Suggestions
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Select any suggestion to use it as your message. Each is tailored based on your campaign type.
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="p-2 border rounded-md text-sm hover:bg-purple-50 cursor-pointer transition-all"
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  <p>{suggestion}</p>
                  <div className="flex justify-end mt-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSuggestionSelect(suggestion);
                      }}
                    >
                      <Wand className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateSuggestions}
              className="w-full text-xs mt-2"
            >
              <MessageSquareHeart className="h-3 w-3 mr-1" />
              Regenerate Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestionPanel;
