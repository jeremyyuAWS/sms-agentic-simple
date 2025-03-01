
import React from 'react';
import { ListOrdered } from 'lucide-react';

interface SequenceSummaryProps {
  followUps: any[];
  getMessageTitle: (index: number, followUp: any) => string;
}

const SequenceSummary: React.FC<SequenceSummaryProps> = ({ followUps, getMessageTitle }) => {
  return (
    <div className="mt-6 bg-slate-50 border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <ListOrdered className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Message Sequence Summary</h3>
      </div>
      <div className="pl-4 border-l-2 border-primary/20 space-y-2">
        {followUps.map((followUp, index) => (
          <div key={`summary-${followUp.id}`} className="flex items-center text-sm">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
              {index + 1}
            </div>
            <span>
              {index === 0 ? 'Initial message' : 
                `${getMessageTitle(index, followUp)}: Sent after ${followUp.delayDays} days`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SequenceSummary;
