
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Edit2, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  // Example text messages for each position in the sequence
  const getExampleMessages = () => {
    if (index === 0) {
      return [
        "Hi {{first_name}}, this is {{sender_name}} from {{company}}. I wanted to reach out about how we can help you increase revenue by 20% with our solution. Would you be open to a quick chat?",
        "{{first_name}}, {{sender_name}} here from {{company}}. Our clients see 30% efficiency gains within 3 months. I'd love to share how we might help your team at {{prospect_company}} too. When's a good time to connect?",
        "Hi {{first_name}}, {{sender_name}} with {{company}}. Based on your role at {{prospect_company}}, I think our {{product_name}} could help you with {{specific_pain_point}}. Can we schedule a quick 15-minute call?"
      ];
    } 
    
    if (index === 1) {
      return [
        "Hi {{first_name}}, just checking in on my previous message. I'd still love to share how {{company}} has helped similar businesses achieve {{specific_benefit}}. Would you have 15 minutes this week?",
        "{{first_name}}, just following up on my previous text. I understand you're busy, but I think {{product_name}} could really help with your {{specific_challenge}}. Let me know if you'd like to learn more.",
        "Quick follow-up, {{first_name}} - I'm still hoping to connect about how {{company}} can help {{prospect_company}} improve {{metric}}. Does Thursday or Friday work better for a brief call?"
      ];
    }
    
    if (index === 2) {
      return [
        "{{first_name}}, I wanted to share that our clients at {{competitor_company}} increased their {{metric}} by {{percentage}}. I'd be happy to explain how we achieved this in a quick call.",
        "Hi {{first_name}}, I've helped 3 other {{role}} professionals solve {{pain_point}} this month. If that's still a priority for {{prospect_company}}, I'd love to share our approach.",
        "{{first_name}}, I'm reaching out one more time because I believe our {{product_name}} would be valuable for your team at {{prospect_company}}. Let me know if you'd like to see a quick demo."
      ];
    }
    
    return [
      "{{first_name}}, I'll make this my final message. If improving your {{metric}} becomes a priority, feel free to reach out anytime at {{phone_number}}. Wishing you continued success!",
      "I understand timing might not be right, {{first_name}}. If you'd like to explore how {{company}} can help {{prospect_company}} in the future, my line is always open at {{phone_number}}.",
      "{{first_name}}, as this will be my last outreach, I wanted to share this resource that addresses {{specific_challenge}}: {{resource_link}}. Feel free to contact me if you find it valuable."
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
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="mr-1 h-4 w-4" />
              {index === 0 ? 
                'Initial message sent immediately' : 
                `Sent ${followUp.delayDays} days after initial message`}
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="examples">
                <AccordionTrigger className="text-sm text-primary py-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View message examples
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    {getExampleMessages().map((message, idx) => (
                      <div key={idx} className="p-3 bg-white border rounded-md text-sm">
                        <p className="text-slate-800">{message}</p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="mt-1 h-auto p-0 text-xs text-primary"
                          onClick={() => {
                            navigator.clipboard.writeText(message);
                          }}
                        >
                          Copy to clipboard
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

            {/* Example messages */}
            <div>
              <label className="text-sm font-medium mb-1 block">Example messages for this step:</label>
              <div className="space-y-2 mt-1">
                {getExampleMessages().map((message, idx) => (
                  <div key={idx} className="p-3 bg-white border rounded-md text-sm">
                    <p className="text-slate-800">{message}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mt-1 h-auto p-0 text-xs text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(message);
                      }}
                    >
                      Copy to clipboard
                    </Button>
                  </div>
                ))}
              </div>
            </div>

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
