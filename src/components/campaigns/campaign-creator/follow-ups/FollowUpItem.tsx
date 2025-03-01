
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Edit2, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FollowUpItemProps {
  followUp: any;
  index: number;
  totalCount: number;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, updates: Partial<any>) => void;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({
  followUp,
  index,
  totalCount,
  getMessageTitle,
  updateFollowUp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(followUp.name || getMessageTitle(index, followUp));
  const [editedDelay, setEditedDelay] = useState(followUp.delayDays?.toString() || "3");

  const handleSaveChanges = () => {
    updateFollowUp(index, {
      name: editedName,
      delayDays: parseInt(editedDelay, 10)
    });
    setIsEditing(false);
  };

  // Common wait times for follow-up messages
  const commonDelayOptions = [
    { value: "2", label: "2 days (aggressive)" },
    { value: "3", label: "3 days (standard)" },
    { value: "5", label: "5 days (relaxed)" },
    { value: "7", label: "7 days (conservative)" },
    { value: "14", label: "14 days (very patient)" }
  ];

  // Suggested messages based on the follow-up position
  const getSuggestedMessageNames = () => {
    if (index === 0) return [];
    
    return [
      { value: `Quick follow-up (#${index})`, tooltip: "A gentle reminder" },
      { value: `Checking in (#${index})`, tooltip: "An unobtrusive check-in" },
      { value: `Value proposition (#${index})`, tooltip: "Highlights your main value" },
      { value: `Final outreach (#${index})`, tooltip: "Last attempt to connect" },
      { value: `Just wondering (#${index})`, tooltip: "Very casual follow-up" }
    ];
  };

  return (
    <div 
      key={followUp.id} 
      className="relative bg-slate-50 border rounded-lg p-4 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-medium">
            {index + 1}
          </div>
          
          {!isEditing ? (
            <h4 className="font-medium">
              {getMessageTitle(index, followUp)}
            </h4>
          ) : (
            <div className="flex-1 flex gap-2">
              <Input 
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Message name"
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSaveChanges}
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        {!isEditing ? (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="mr-1 h-4 w-4" />
            {index === 0 ? 
              'Initial message sent immediately' : 
              `Sent ${followUp.delayDays} days after initial message`}
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {/* Timing selection */}
            <div>
              <label className="text-sm font-medium mb-1 block">When to send this message:</label>
              <Select
                value={editedDelay}
                onValueChange={setEditedDelay}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  {commonDelayOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Suggested message names */}
            {getSuggestedMessageNames().length > 0 && (
              <div>
                <label className="text-sm font-medium mb-1 block">Suggested message titles:</label>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedMessageNames().map((suggestion, idx) => (
                    <TooltipProvider key={idx}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditedName(suggestion.value)}
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
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-2 rounded-md text-xs text-blue-700 flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>
                {index === 0 ? 
                  "This is your initial message. It will be sent immediately when the campaign starts." : 
                  "Follow-up messages work best when they're concise and add new value rather than just asking again."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpItem;
