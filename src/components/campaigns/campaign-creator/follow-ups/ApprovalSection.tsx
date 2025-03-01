
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ApprovalSectionProps {
  approved: boolean;
  handleApproveSequence: () => void;
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({
  approved,
  handleApproveSequence,
}) => {
  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Review and Approve</h3>
          <p className="text-sm text-muted-foreground">
            Review your message sequence before finalizing the campaign.
          </p>
        </div>
        <div className="flex gap-4">
          {!approved ? (
            <Button 
              onClick={handleApproveSequence}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Sequence
            </Button>
          ) : (
            <Button 
              onClick={() => {}}
              className="bg-primary hover:bg-primary/90"
              disabled
            >
              Sequence Approved
            </Button>
          )}
        </div>
      </div>
      {approved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span>Message sequence approved! You can now complete the campaign setup.</span>
        </div>
      )}
    </div>
  );
};

export default ApprovalSection;
