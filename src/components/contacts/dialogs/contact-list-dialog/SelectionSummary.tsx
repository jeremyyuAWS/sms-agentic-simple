
import React from 'react';
import { Button } from '@/components/ui/button';
import { Contact } from '@/lib/types';

interface SelectionSummaryProps {
  selectedContactIds: string[];
  filteredContacts: Contact[];
  totalContacts: number;
  onClearSelection: () => void;
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selectedContactIds,
  filteredContacts,
  totalContacts,
  onClearSelection
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Selected {selectedContactIds.length} of {filteredContacts.length} contacts
        {filteredContacts.length !== totalContacts ? ` (filtered from ${totalContacts} total)` : ''}
      </p>
      
      {selectedContactIds.length > 0 && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearSelection}
        >
          Clear selection
        </Button>
      )}
    </div>
  );
};

export default SelectionSummary;
