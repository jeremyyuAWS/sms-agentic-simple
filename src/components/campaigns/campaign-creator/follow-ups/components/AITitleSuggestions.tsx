
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AITitleSuggestionsProps {
  campaignType: string;
  followUpIndex: number;
  onTitleSelect: (title: string) => void;
}

const AITitleSuggestions: React.FC<AITitleSuggestionsProps> = ({
  campaignType,
  followUpIndex,
  onTitleSelect
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Enhanced AI title suggestions based on campaign type and follow-up position
  const getTitleSuggestions = (type: string, index: number, advanced: boolean): string[] => {
    if (index === 0) {
      // Initial message titles
      if (advanced) {
        switch(type) {
          case 'event-invitation':
            return [
              "Exclusive Industry Insights: {{event_name}} Invitation",
              "Join Industry Leaders at {{event_name}} - Limited Spots",
              "{{company}}'s {{event_type}}: Solutions for {{industry_challenge}}"
            ];
          case 'sales-outreach':
            return [
              "{{pain_point}} Solution for {{company}}",
              "Proven Strategy: Increase {{metric}} at {{company}}",
              "{{first_name}}, Let's Solve {{specific_challenge}} Together"
            ];
          case 'follow-up-reminder':
            return [
              "Important Update: Our Discussion on {{topic}}",
              "Next Steps for {{company}}'s {{initiative}}",
              "Addressing {{pain_point}}: New Information"
            ];
          default:
            return [
              "Personalized Solution for {{company}}'s {{challenge}}",
              "Innovation Partner for {{company}}'s Growth",
              "Strategic Opportunity: {{benefit}} for {{company}}"
            ];
        }
      } else {
        switch(type) {
          case 'event-invitation':
            return ["Exclusive Event Invitation", "Join Our Industry Event", "Special Event Access"];
          case 'sales-outreach':
            return ["Partnership Opportunity", "Solution for Your Business", "Growth Strategy Discussion"];
          case 'follow-up-reminder':
            return ["Important Follow-up", "Quick Check-in", "Action Required"];
          default:
            return ["Initial Outreach", "Introduction", "Let's Connect"];
        }
      }
    } else {
      // Follow-up message titles
      if (advanced) {
        // More sophisticated follow-up titles based on position in sequence
        if (index === 1) {
          return [
            `Adding Value: Additional Insights on {{topic}}`,
            `In Case You Missed It: {{key_benefit}} Opportunity`,
            `Quick Question About {{company}}'s {{initiative}}`
          ];
        } else if (index === 2) {
          return [
            `Case Study: How {{similar_company}} Solved {{pain_point}}`,
            `Industry Insight: {{industry_trend}} Impact on {{company}}`,
            `Just Released: New Solution for {{specific_challenge}}`
          ];
        } else {
          return [
            `Final Thoughts on {{company}}'s {{opportunity}}`,
            `Value Summary: {{key_point_1}}, {{key_point_2}}, and {{key_point_3}}`,
            `Before I Go: Important {{industry}} Update for {{company}}`
          ];
        }
      } else {
        return [
          `Follow-up #${index}`,
          `Quick check-in #${index}`,
          `Additional value #${index}`,
          `One more thing #${index}`,
          `Just checking in #${index}`
        ];
      }
    }
  };
  
  const handleGenerateTitles = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const allSuggestions = getTitleSuggestions(campaignType, followUpIndex, isAdvancedMode);
      setSuggestions(allSuggestions);
      
      // Pick a random suggestion for immediate use
      const randomTitle = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
      onTitleSelect(randomTitle);
      
      setIsLoading(false);
      toast({
        title: `AI Title Generated (${isAdvancedMode ? 'Advanced' : 'Standard'})`,
        description: "A message title has been suggested based on your campaign"
      });
    }, 800);
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
    setSuggestions([]);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${isAdvancedMode ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Sparkles className="h-3 w-3 mr-1" />
          )}
          AI Title Suggestion
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">AI Title Generator</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs ${isAdvancedMode ? 'text-purple-700' : ''}`}
              onClick={toggleAdvancedMode}
            >
              {isAdvancedMode ? (
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  <span>Advanced</span>
                </span>
              ) : 'Advanced Mode'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {isAdvancedMode 
              ? 'Generate highly personalized titles with dynamic variables based on recipient data.'
              : 'Generate appropriate titles for your message based on campaign type and sequence position.'}
          </p>
          
          <Button
            size="sm"
            onClick={handleGenerateTitles}
            className={`w-full text-xs ${isAdvancedMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : (
              <span className="flex items-center justify-center gap-1">
                <Brain className="h-3 w-3" />
                <span>Generate Title</span>
              </span>
            )}
          </Button>
          
          {suggestions.length > 0 && (
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-medium">All Suggestions:</h5>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 text-xs rounded cursor-pointer hover:bg-gray-100 ${isAdvancedMode ? 'border border-purple-100' : 'border'}`}
                    onClick={() => {
                      onTitleSelect(suggestion);
                      toast({
                        title: "Title Applied",
                        description: "The selected title has been applied to your message"
                      });
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AITitleSuggestions;
