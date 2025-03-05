
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  // Mock data for AI title suggestions based on campaign type and follow-up index
  const getTitleSuggestions = (type: string, index: number): string[] => {
    if (index === 0) {
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
    } else {
      return [
        `Follow-up #${index}`,
        `Quick check-in #${index}`,
        `Additional value #${index}`,
        `One more thing #${index}`,
        `Just checking in #${index}`
      ];
    }
  };
  
  const handleGenerateTitles = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const suggestions = getTitleSuggestions(campaignType, followUpIndex);
      
      // Pick a random suggestion
      const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
      onTitleSelect(randomTitle);
      
      setIsLoading(false);
      toast({
        title: "AI Title Generated",
        description: "A message title has been suggested based on your campaign"
      });
    }, 800);
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateTitles}
      className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
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
  );
};

export default AITitleSuggestions;
