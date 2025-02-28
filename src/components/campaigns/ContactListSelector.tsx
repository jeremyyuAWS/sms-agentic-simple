
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Check, Search, Upload, Users } from 'lucide-react';
import { useApp } from '@/contexts';

interface ContactListSelectorProps {
  selectedContactIds: string[];
  selectedListId?: string;
  onContactsSelect: (contactIds: string[]) => void;
  onListSelect: (listId?: string) => void;
}

const ContactListSelector: React.FC<ContactListSelectorProps> = ({
  selectedContactIds,
  selectedListId,
  onContactsSelect,
  onListSelect,
}) => {
  const { contacts, contactLists } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('lists');
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber?.includes(searchTerm)
  );
  
  // Handle contact selection
  const handleContactToggle = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      onContactsSelect(selectedContactIds.filter(id => id !== contactId));
    } else {
      onContactsSelect([...selectedContactIds, contactId]);
    }
    // Clear list selection if selecting individual contacts
    if (selectedListId) {
      onListSelect(undefined);
    }
  };
  
  // Handle list selection
  const handleListSelect = (listId: string) => {
    if (selectedListId === listId) {
      onListSelect(undefined);
    } else {
      onListSelect(listId);
      // Clear individual contact selection
      onContactsSelect([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Select Your Audience</h2>
        <p className="text-muted-foreground mt-2">
          Choose which contacts you want to include in your campaign
        </p>
      </div>
      
      <Tabs defaultValue="lists" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="lists">Contact Lists</TabsTrigger>
          <TabsTrigger value="contacts">Individual Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lists">
          {contactLists.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No contact lists yet</h3>
              <p className="text-muted-foreground mb-4">
                Import contacts from a CSV to create your first list
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Contacts
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactLists.map(list => (
                <Card 
                  key={list.id}
                  className={`cursor-pointer transition-all hover:border-primary ${selectedListId === list.id ? 'border-primary border-2' : ''}`}
                  onClick={() => handleListSelect(list.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      {selectedListId === list.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {list.description || 'No description'}
                    </p>
                    <div className="mt-2 text-sm font-medium">
                      {list.contactIds?.length || 0} contacts
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contacts">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted text-muted-foreground text-sm">
                  <tr>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium hidden sm:table-cell">Company</th>
                    <th className="p-3 text-left font-medium hidden md:table-cell">Phone</th>
                    <th className="p-3 text-center font-medium w-20">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No contacts found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(contact => (
                      <tr 
                        key={contact.id}
                        className={`border-t hover:bg-muted/50 ${selectedContactIds.includes(contact.id) ? 'bg-primary/5' : ''}`}
                      >
                        <td className="p-3">{contact.name}</td>
                        <td className="p-3 hidden sm:table-cell">{contact.company || '-'}</td>
                        <td className="p-3 hidden md:table-cell">{contact.phoneNumber}</td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant={selectedContactIds.includes(contact.id) ? "default" : "outline"}
                            onClick={() => handleContactToggle(contact.id)}
                            className="h-8 w-8 p-0"
                          >
                            {selectedContactIds.includes(contact.id) && (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {filteredContacts.length} contacts
              </span>
              <span className="font-medium">
                {selectedContactIds.length} selected
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactListSelector;
