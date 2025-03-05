
import React, { useState, useEffect } from 'react';
import { Contact, ContactList } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useContacts } from '@/hooks/use-contacts';
import ContactListForm from './contact-list-dialog/ContactListForm';
import ContactSelectionTable from './contact-list-dialog/ContactSelectionTable';
import ContactFilters from './contact-list-dialog/ContactFilters';
import SelectionSummary from './contact-list-dialog/SelectionSummary';

interface ContactListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingContactList: ContactList | null;
  onCreateList: (name: string, description: string, contactIds: string[]) => void;
  groupedContacts: Record<string, Contact[]>;
  sortedGroups: [string, Contact[]][];
}

const ContactListDialog: React.FC<ContactListDialogProps> = ({
  isOpen,
  onOpenChange,
  editingContactList,
  onCreateList,
  groupedContacts,
  sortedGroups
}) => {
  const { contacts } = useContacts();
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');

  // Reset form when dialog opens with a new editing state
  useEffect(() => {
    if (isOpen) {
      if (editingContactList) {
        setNewListName(editingContactList.name);
        setNewListDescription(editingContactList.description || '');
        setSelectedContactIds([...editingContactList.contactIds]);
      } else {
        setNewListName('');
        setNewListDescription('');
        setSelectedContactIds([]);
      }
      setSelectedSourceFilter('all');
      setSearchQuery('');
    }
  }, [isOpen, editingContactList]);

  const handleSourceFilterChange = (sourceKey: string) => {
    setSelectedSourceFilter(sourceKey);
    
    if (!editingContactList && !newListName.trim() && sourceKey !== 'all' && sourceKey !== 'untracked') {
      setNewListName(`Contacts from "${sourceKey}"`);
    }
    
    setSelectedContactIds([]);
  };

  const filteredContacts = contacts.filter(contact => {
    if (selectedSourceFilter !== 'all') {
      if (selectedSourceFilter === 'untracked') {
        if (contact.source) return false;
      } else {
        if (!contact.source || contact.source.name !== selectedSourceFilter) return false;
      }
    }
    
    if (searchQuery.trim()) {
      return (
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  const toggleContactSelection = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAllContacts = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const getSourceCount = (sourceKey: string): number => {
    if (sourceKey === 'all') return contacts.length;
    if (sourceKey === 'untracked') {
      return contacts.filter(c => !c.source).length;
    }
    return groupedContacts[sourceKey]?.length || 0;
  };

  const handleSubmit = () => {
    onCreateList(newListName, newListDescription, selectedContactIds);
  };

  const resetFilters = () => {
    setSelectedSourceFilter('all');
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingContactList ? "Edit Contact List" : "Create New Contact List"}</DialogTitle>
          <DialogDescription>
            {editingContactList 
              ? "Update your contact list details and membership."
              : "Create a new list to organize contacts for targeted campaigns."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <ContactListForm 
            name={newListName} 
            description={newListDescription}
            onNameChange={setNewListName}
            onDescriptionChange={setNewListDescription}
          />
          
          <div className="space-y-3">
            <ContactFilters
              selectedSourceFilter={selectedSourceFilter}
              searchQuery={searchQuery}
              sortedGroups={sortedGroups}
              getSourceCount={getSourceCount}
              onSourceFilterChange={handleSourceFilterChange}
              onSearchQueryChange={setSearchQuery}
              onSelectAllToggle={toggleSelectAllContacts}
              filteredContacts={filteredContacts}
              selectedContactIds={selectedContactIds}
              resetFilters={resetFilters}
            />
            
            <ContactSelectionTable 
              filteredContacts={filteredContacts}
              selectedContactIds={selectedContactIds}
              selectedSourceFilter={selectedSourceFilter}
              toggleContactSelection={toggleContactSelection}
            />
            
            <SelectionSummary 
              selectedContactIds={selectedContactIds}
              filteredContacts={filteredContacts}
              totalContacts={contacts.length}
              onClearSelection={() => setSelectedContactIds([])}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedContactIds.length === 0 || !newListName.trim()}>
            {editingContactList ? "Update List" : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactListDialog;
