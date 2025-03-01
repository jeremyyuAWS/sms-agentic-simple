
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TitleSuggestion {
  value: string;
  tooltip: string;
}

interface SuggestedTitlesProps {
  suggestions: TitleSuggestion[];
  onSelect: (title: string) => void;
}

const SuggestedTitles: React.FC<SuggestedTitlesProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Suggested message titles:</label>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(suggestion.value)}
                  className="text-xs"
                >
                  {suggestion.value}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{suggestion.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTitles;
