import React, { useState, useEffect } from 'react';
import { Contact, ContactList } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Users, Filter, X } from 'lucide-react';
import { useContacts } from '@/hooks/use-contacts';

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
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="listName" className="text-sm font-medium">
                List Name*
              </label>
              <Input
                id="listName"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="E.g., Q2 Sales Prospects"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="listDescription" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="listDescription"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="Add a description to help identify this list"
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Select Contacts for this List</span>
              </h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="w-full sm:w-[220px]">
                  <Select
                    value={selectedSourceFilter}
                    onValueChange={handleSourceFilterChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts ({contacts.length})</SelectItem>
                      {sortedGroups.map(([groupName]) => (
                        <SelectItem key={groupName} value={groupName}>
                          {groupName} ({getSourceCount(groupName)})
                        </SelectItem>
                      ))}
                      {contacts.some(c => !c.source) && (
                        <SelectItem value="untracked">Untracked ({getSourceCount('untracked')})</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-[250px] relative">
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleSelectAllContacts}
                  className="whitespace-nowrap"
                >
                  {selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>
            
            {(selectedSourceFilter !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2 p-2 bg-muted/40 rounded-md">
                <div className="text-xs text-muted-foreground flex items-center">
                  <Filter className="h-3 w-3 mr-1" />
                  Filters:
                </div>
                
                {selectedSourceFilter !== 'all' && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                    Source: {selectedSourceFilter}
                    <button 
                      onClick={() => setSelectedSourceFilter('all')}
                      className="ml-1 rounded-full hover:bg-primary/10 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                    Search: {searchQuery}
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1 rounded-full hover:bg-primary/10 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                <button 
                  onClick={() => {
                    setSelectedSourceFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-primary hover:underline ml-auto"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            <div className="border rounded-md h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="mb-2">No contacts found with the current filters.</div>
                          {selectedSourceFilter !== 'all' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSourceFilter('all')}
                            >
                              Show all contacts
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map((contact) => (
                      <TableRow 
                        key={contact.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleContactSelection(contact.id)}
                      >
                        <TableCell className="align-middle">
                          <input
                            type="checkbox"
                            checked={selectedContactIds.includes(contact.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>
                          {contact.email || contact.phoneNumber}
                        </TableCell>
                        <TableCell>
                          {contact.company || '-'}
                        </TableCell>
                        <TableCell>
                          {contact.source ? (
                            <Badge variant="outline" className="capitalize">
                              {contact.source.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100">
                              Untracked
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Selected {selectedContactIds.length} of {filteredContacts.length} contacts
                {filteredContacts.length !== contacts.length ? ` (filtered from ${contacts.length} total)` : ''}
              </p>
              
              {selectedContactIds.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedContactIds([])}
                >
                  Clear selection
                </Button>
              )}
            </div>
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
