
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Edit2 } from 'lucide-react';
import MessageExamples from './MessageExamples';

interface MessageViewProps {
  message: string | undefined;
  delayDays: number;
  isInitialMessage: boolean;
  onEdit: () => void;
  examples: string[];
  onSelectExample: (message: string) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ 
  message, 
  delayDays, 
  isInitialMessage, 
  onEdit, 
  examples,
  onSelectExample
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Clock className="mr-1 h-4 w-4" />
        {isInitialMessage ? 
          'Initial message sent immediately' : 
          `Sent ${delayDays} days after initial message`}
      </div>
      
      {message && (
        <div className="p-3 bg-white border rounded-md text-sm mt-2">
          <p className="text-slate-800">{message}</p>
        </div>
      )}
      
      {!message && (
        <div className="p-3 border border-dashed rounded-md bg-white text-sm text-muted-foreground mt-2">
          <p>No message content set. Click Edit to add a message.</p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <MessageExamples 
          examples={examples} 
          onSelectExample={onSelectExample} 
          onOpenEditor={onEdit} 
        />
      </div>
    </div>
  );
};

export default MessageView;
