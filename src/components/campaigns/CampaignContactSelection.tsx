
import React, { useState } from 'react';
import { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface CampaignContactSelectionProps {
  contacts: Contact[];
  selectedContactIds: string[];
  onChange: (selectedIds: string[]) => void;
}

const CampaignContactSelection: React.FC<CampaignContactSelectionProps> = ({
  contacts,
  selectedContactIds,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const searchString = `${contact.firstName} ${contact.lastName} ${contact.email}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  // Handle contact selection
  const handleToggleContact = (contactId: string) => {
    const updatedSelection = selectedContactIds.includes(contactId)
      ? selectedContactIds.filter(id => id !== contactId)
      : [...selectedContactIds, contactId];
    
    onChange(updatedSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      onChange([]);
    } else {
      onChange(filteredContacts.map(contact => contact.id));
    }
  };

  const allSelected = filteredContacts.length > 0 && 
    filteredContacts.every(contact => selectedContactIds.includes(contact.id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex items-center space-x-2 py-2">
        <Checkbox 
          id="select-all" 
          checked={allSelected} 
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          {allSelected ? "Deselect all" : "Select all"} ({filteredContacts.length})
        </label>
        {selectedContactIds.length > 0 && (
          <span className="text-sm text-muted-foreground ml-auto">
            {selectedContactIds.length} selected
          </span>
        )}
      </div>
      
      {filteredContacts.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No contacts found. Try a different search term.
        </div>
      ) : (
        <ScrollArea className="h-[300px] border rounded-md p-2">
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                <Checkbox 
                  id={`contact-${contact.id}`} 
                  checked={selectedContactIds.includes(contact.id)}
                  onCheckedChange={() => handleToggleContact(contact.id)}
                />
                <label 
                  htmlFor={`contact-${contact.id}`} 
                  className="flex flex-1 items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                      <div className="text-xs text-muted-foreground">{contact.email}</div>
                    </div>
                  </div>
                  {contact.company && (
                    <div className="text-sm text-muted-foreground hidden md:block">
                      {contact.company}
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CampaignContactSelection;
