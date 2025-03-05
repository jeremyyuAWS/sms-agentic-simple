
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAiService } from '@/hooks/use-ai-service';
import { Sparkles, Clock, RotateCw, CheckCircle2 } from 'lucide-react';
import { FollowUpSuggestionResponse } from '@/lib/types/ai-services';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface FollowUpSuggestionsProps {
  previousMessages: any[];
  campaignContext: any;
  onSelectSuggestion: (message: string, delayDays: number) => void;
}

const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  previousMessages,
  campaignContext,
  onSelectSuggestion
}) => {
  const [suggestions, setSuggestions] = useState<FollowUpSuggestionResponse['suggestions']>([]);
  const { generateFollowUpSuggestions, isGeneratingSuggestions } = useAiService();
  
  useEffect(() => {
    // Auto-generate suggestions when component mounts
    if (previousMessages.length > 0) {
      handleGenerateSuggestions();
    }
  }, []);
  
  const handleGenerateSuggestions = async () => {
    const result = await generateFollowUpSuggestions(previousMessages, campaignContext);
    
    if (result) {
      setSuggestions(result.suggestions);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI-Suggested Follow-ups</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateSuggestions}
          disabled={isGeneratingSuggestions}
        >
          {isGeneratingSuggestions ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Refresh Suggestions
            </>
          )}
        </Button>
      </div>
      
      {isGeneratingSuggestions && (
        <div className="py-8 text-center">
          <RotateCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Generating smart follow-up suggestions...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="border-indigo-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                AI Suggestion {index + 1}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5" />
                {suggestion.timing.delayDays === 0
                  ? 'Send immediately'
                  : `Send after ${suggestion.timing.delayDays} day${suggestion.timing.delayDays > 1 ? 's' : ''}`}
                {suggestion.timing.bestTimeOfDay && ` at ${suggestion.timing.bestTimeOfDay}`}
              </div>
            </CardHeader>
            
            <CardContent className="pt-2">
              <p className="text-sm whitespace-pre-line">{suggestion.message}</p>
              
              <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                <span>Expected response rate: {(suggestion.expectedResponseRate * 100).toFixed(0)}%</span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button
                size="sm"
                className="w-full"
                onClick={() => onSelectSuggestion(suggestion.message, suggestion.timing.delayDays)}
              >
                Use This Suggestion
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {suggestions.length === 0 && !isGeneratingSuggestions && (
        <div className="text-center py-6 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">
            No suggestions available yet. Click "Generate Suggestions" to create smart follow-ups.
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowUpSuggestions;
