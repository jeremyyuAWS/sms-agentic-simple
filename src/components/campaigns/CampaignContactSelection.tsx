
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface CampaignContactSelectionProps {
  selectedContactIds: string[];
  contactListId?: string;
  segmentId?: string;
  onContactsSelect: (contacts: string[]) => void;
  onListSelect: (listId?: string) => void;
  onSegmentSelect: (segmentId?: string) => void;
}

const CampaignContactSelection: React.FC<CampaignContactSelectionProps> = ({
  selectedContactIds,
  contactListId,
  segmentId,
  onContactsSelect,
  onListSelect,
  onSegmentSelect
}) => {
  const { contacts, contactLists, contactSegments } = useApp();
  const [isSelectContactsOpen, setIsSelectContactsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>(selectedContactIds);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const phone = contact.phoneNumber.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           email.includes(query) || 
           phone.includes(query);
  });

  // Handle opening the contact selection modal
  const handleOpenContactSelect = () => {
    setSelectedContacts(selectedContactIds);
    setIsSelectContactsOpen(true);
  };

  // Handle confirming contact selection
  const handleConfirmSelection = () => {
    onContactsSelect(selectedContacts);
    setIsSelectContactsOpen(false);
  };

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Contacts</h2>
      <p className="text-muted-foreground">
        Choose contacts for your campaign by selecting individuals or a contact list.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Lists Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contactLists.map(list => (
                <div 
                  key={list.id}
                  className={`p-2 border rounded cursor-pointer ${
                    contactListId === list.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => onListSelect(list.id)}
                >
                  <div className="font-medium">{list.name}</div>
                  <div className="text-sm text-muted-foreground">{list.contactIds.length} contacts</div>
                </div>
              ))}
              
              {contactLists.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No contact lists available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Individual Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Select individual contacts for more targeted campaigns
              </p>
              <Button onClick={handleOpenContactSelect}>
                Select Contacts
              </Button>
              
              {selectedContactIds.length > 0 && (
                <div className="mt-4 text-sm">
                  {selectedContactIds.length} contacts selected
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Selection Modal */}
      <Dialog open={isSelectContactsOpen} onOpenChange={setIsSelectContactsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Contacts</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No contacts found matching your search
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className="flex items-center space-x-3 p-2 border rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    <Checkbox 
                      checked={selectedContacts.includes(contact.id)} 
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                    />
                    <div>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email || contact.phoneNumber}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              {selectedContacts.length} contacts selected
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSelectContactsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection}>
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignContactSelection;
