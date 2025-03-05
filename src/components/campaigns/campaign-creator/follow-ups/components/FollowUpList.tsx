
import React from 'react';
import { Button } from '@/components/ui/button';
import FollowUpItem from '../FollowUpItem';
import { PlusCircle } from 'lucide-react';

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
      
      {/* Add follow-up button with enhanced styling */}
      <Button 
        variant="outline" 
        className="w-full mt-6 py-6 border-dashed border-2 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
        onClick={onAddFollowUp}
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        <span className="font-medium">Add Follow-up Message</span>
      </Button>
    </div>
  );
};

export default FollowUpList;
