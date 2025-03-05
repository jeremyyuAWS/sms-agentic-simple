
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium">Message Sequence</h3>
      </div>
      
      <div className="space-y-3">
        {followUps.map((followUp, index) => (
          <FollowUpItem
            key={followUp.id}
            followUp={followUp}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            getMessageTitle={getMessageTitle}
            updateFollowUp={updateFollowUp}
            campaignType={campaignType}
          />
        ))}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onAddFollowUp}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Follow-Up Message
      </Button>
    </div>
  );
};

export default FollowUpList;
