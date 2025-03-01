
import React from 'react';
import { Button } from '@/components/ui/button';
import FollowUpItem from '../FollowUpItem';

interface FollowUpListProps {
  followUps: any[];
  selectedTemplateId: string;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, updates: Partial<any>) => void;
  onAddFollowUp: () => void;
}

const FollowUpList: React.FC<FollowUpListProps> = ({
  followUps,
  selectedTemplateId,
  getMessageTitle,
  updateFollowUp,
  onAddFollowUp
}) => {
  return (
    <div className="space-y-6">
      {/* Pre-defined message sequence */}
      {followUps.map((followUp, index) => (
        <FollowUpItem
          key={followUp.id}
          followUp={followUp}
          index={index}
          totalCount={followUps.length}
          getMessageTitle={getMessageTitle}
          updateFollowUp={updateFollowUp}
        />
      ))}
      
      {/* Add follow-up button */}
      <Button 
        variant="outline" 
        className="w-full mt-4 border-dashed"
        onClick={onAddFollowUp}
      >
        Add Follow-up Message
      </Button>
    </div>
  );
};

export default FollowUpList;
