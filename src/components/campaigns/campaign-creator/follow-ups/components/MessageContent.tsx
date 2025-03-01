
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';

interface MessageContentProps {
  value: string;
  onChange: (value: string) => void;
  exampleMessages: string[];
  onSelectExample: (message: string) => void;
  isInitialMessage: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ 
  value, 
  onChange, 
  exampleMessages,
  onSelectExample,
  isInitialMessage
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-1 block">Message content:</label>
        <Textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your message content here..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Or select from example messages:</label>
        <Select onValueChange={onSelectExample}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose an example message" />
          </SelectTrigger>
          <SelectContent>
            {exampleMessages.map((example, idx) => (
              <SelectItem key={idx} value={example}>
                <div className="truncate max-w-[300px]">{example.substring(0, 60)}...</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 p-2 rounded-md text-xs text-blue-700 flex items-start">
        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>
          {isInitialMessage ? 
            "This is your initial message. It will be sent when the campaign starts according to your schedule settings." : 
            "Follow-up messages work best when they're concise and add new value rather than just asking again."}
        </span>
      </div>
    </div>
  );
};

export default MessageContent;
