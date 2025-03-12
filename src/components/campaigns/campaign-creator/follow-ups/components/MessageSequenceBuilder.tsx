
import React from 'react';
import { Button } from '@/components/ui/button';
import FollowUpList from './FollowUpList';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageSequenceBuilderProps {
  followUps: any[];
  selectedTemplateId: string;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, update: Partial<any>) => void;
  onAddFollowUp: () => void;
  campaignType?: string;
}

const MessageSequenceBuilder: React.FC<MessageSequenceBuilderProps> = ({
  followUps,
  selectedTemplateId,
  getMessageTitle,
  updateFollowUp,
  onAddFollowUp,
  campaignType = 'event-invitation'
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Message Sequence</h3>
        <Button 
          variant="outline" 
          onClick={onAddFollowUp}
          size="sm"
        >
          Add Message
        </Button>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <FollowUpList
          followUps={followUps}
          selectedTemplateId={selectedTemplateId}
          getMessageTitle={getMessageTitle}
          updateFollowUp={updateFollowUp}
          onAddFollowUp={onAddFollowUp}
          campaignType={campaignType}
        />
      </ScrollArea>
    </div>
  );
};

export default MessageSequenceBuilder;
