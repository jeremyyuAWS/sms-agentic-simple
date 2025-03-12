
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDown } from 'lucide-react';
import FollowUpItem from '../FollowUpItem';

interface FollowUpListProps {
  followUps: any[];
  selectedTemplateId: string;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, update: Partial<any>) => void;
  onAddFollowUp: () => void;
  campaignType?: string;
}

const FollowUpList: React.FC<FollowUpListProps> = ({
  followUps,
  selectedTemplateId,
  getMessageTitle,
  updateFollowUp,
  onAddFollowUp,
  campaignType = 'event-invitation'
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Show clear instructions if no follow-ups exist
  if (followUps.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">No messages in your sequence yet</p>
        <Button onClick={onAddFollowUp}>
          <Plus className="h-4 w-4 mr-2" />
          Add First Message
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {followUps.map((followUp, index) => (
        <React.Fragment key={followUp.id}>
          <FollowUpItem
            followUp={followUp}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            getMessageTitle={getMessageTitle}
            updateFollowUp={updateFollowUp}
            campaignType={campaignType}
          />
          
          {/* Show connector between messages */}
          {index < followUps.length - 1 && (
            <div className="flex justify-center my-1">
              <div className="h-6 border-l border-dashed border-gray-300 flex items-center">
                <ArrowDown className="h-4 w-4 text-gray-400 -ml-2" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      
      <Button 
        variant="outline" 
        onClick={onAddFollowUp}
        className="w-full mt-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Follow-Up Message
      </Button>
    </div>
  );
};

export default FollowUpList;
