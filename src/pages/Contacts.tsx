
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Contact, ContactList } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookUser, FileText, Import, Info, ListFilter, Users, Plus, Edit, Trash2, List } from 'lucide-react';
import CSVUploader from '@/components/contacts/CSVUploader';
import PDFUploader from '@/components/contacts/PDFUploader';
import KnowledgeBaseList from '@/components/contacts/KnowledgeBaseList';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Contacts: React.FC = () => {
  const { 
    contacts, 
    uploadContacts, 
    knowledgeBases,
    uploadKnowledgeBase,
    deleteKnowledgeBase,
    contactLists,
    createContactList,
    updateContactList,
    deleteContactList
  } = useApp();
  
  const { toast } = useToast();
  const [activeTabPage, setActiveTabPage] = useState('contacts');
  const [isContactListDialogOpen, setIsContactListDialogOpen] = useState(false);
  const [editingContactList, setEditingContactList] = useState<ContactList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleContactsUploaded = (
    newContacts: Contact[], 
    source: {
      type: 'csv' | 'manual' | 'import' | 'api';
      name: string;
      filename?: string;
    }
  ) => {
    uploadContacts(newContacts, source);
  };

  // Group contacts by their source
  const groupedContacts = contacts.reduce((groups, contact) => {
    if (!contact.source) {
      // Group contacts with no source as "Untracked"
      const key = 'Untracked';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    } else {
      // Group by import batch name
      const key = contact.source.name;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    }
    return groups;
  }, {} as Record<string, Contact[]>);

  // Sort groups by date (newest first) or alphabetically if no date
  const sortedGroups = Object.entries(groupedContacts).sort((a, b) => {
    const dateA = a[1][0]?.source?.importedAt;
    const dateB = b[1][0]?.source?.importedAt;
    
    if (dateA && dateB) {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }
    if (dateA) return -1;
    if (dateB) return 1;
    return a[0].localeCompare(b[0]);
  });

  // Handle creating a new contact list
  const handleCreateContactList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your contact list.",
        variant: "destructive"
      });
      return;
    }

    if (selectedContactIds.length === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one contact for your list.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingContactList) {
      // Update existing list
      updateContactList(editingContactList.id, {
        name: newListName,
        description: newListDescription,
        contactIds: selectedContactIds
      });
      
      toast({
        title: "Contact List Updated",
        description: `Successfully updated "${newListName}" with ${selectedContactIds.length} contacts.`
      });
    } else {
      // Create new list
      createContactList({
        name: newListName,
        description: newListDescription,
        contactIds: selectedContactIds,
        source: 'manual'
      });
      
      toast({
        title: "Contact List Created",
        description: `Successfully created "${newListName}" with ${selectedContactIds.length} contacts.`
      });
    }
    
    // Reset form and close dialog
    setNewListName('');
    setNewListDescription('');
    setSelectedContactIds([]);
    setEditingContactList(null);
    setIsContactListDialogOpen(false);
  };

  // Handle opening the edit dialog for a contact list
  const handleEditContactList = (list: ContactList) => {
    setEditingContactList(list);
    setNewListName(list.name);
    setNewListDescription(list.description || '');
    setSelectedContactIds([...list.contactIds]);
    setIsContactListDialogOpen(true);
  };

  // Handle deleting a contact list
  const handleDeleteContactList = (listId: string) => {
    if (confirm("Are you sure you want to delete this contact list? This action cannot be undone.")) {
      deleteContactList(listId);
      
      toast({
        title: "Contact List Deleted",
        description: "The contact list has been removed. Individual contacts remain in the system."
      });
    }
  };

  // Handle opening the dialog for creating a new list
  const handleOpenNewListDialog = () => {
    setEditingContactList(null);
    setNewListName('');
    setNewListDescription('');
    setSelectedContactIds([]);
    setIsContactListDialogOpen(true);
  };

  // Filter contacts based on search query
  const filteredContacts = searchQuery.trim() 
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Select/deselect all contacts
  const toggleSelectAllContacts = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contacts & Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Manage your contacts and campaign knowledge base files
        </p>
      </div>

      <Tabs defaultValue="contacts" value={activeTabPage} onValueChange={setActiveTabPage}>
        <TabsList className="mb-6">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <BookUser className="h-4 w-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="imports" className="flex items-center gap-2">
            <Import className="h-4 w-4" />
            <span>Import History</span>
          </TabsTrigger>
          <TabsTrigger value="lists" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Contact Lists</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Knowledge Base</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Import className="h-5 w-5 text-primary" />
                Import Contacts
              </CardTitle>
              <CardDescription>
                Upload a CSV file with your contacts information. Contacts will be added to your central contact pool.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader onContactsUploaded={handleContactsUploaded} />
            </CardContent>
          </Card>

          {contacts.length > 0 && (
            <Alert className="mt-8">
              <Info className="h-4 w-4" />
              <AlertTitle>Contact List Status</AlertTitle>
              <AlertDescription>
                You have {contacts.length} contacts in your database.
                To view and manage your contacts, go to the Campaigns page to create a new campaign.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="imports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-primary" />
                Import History
              </CardTitle>
              <CardDescription>
                View all contact import batches and manage your contact pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No contact imports yet. Upload contacts first.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Import Name</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Contacts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedGroups.map(([groupName, groupContacts]) => (
                        <TableRow key={groupName}>
                          <TableCell className="font-medium">
                            {groupName}
                          </TableCell>
                          <TableCell>
                            {groupContacts[0]?.source?.type ? (
                              <Badge variant="outline" className="capitalize">
                                {groupContacts[0]?.source?.type || 'unknown'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100">
                                Untracked
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {groupContacts[0]?.source?.importedAt ? (
                              format(new Date(groupContacts[0].source.importedAt), 'MMM d, yyyy h:mm a')
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge>{groupContacts.length}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>
                      All contacts are stored in a central contact pool. When creating campaigns, 
                      you can filter contacts by their import batch, tags, or other properties.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Contact Lists
                </CardTitle>
                <CardDescription>
                  Create and manage contact lists for your campaigns
                </CardDescription>
              </div>
              <Button onClick={handleOpenNewListDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New List
              </Button>
            </CardHeader>
            <CardContent>
              {contactLists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No contact lists yet. Create your first list to organize contacts for campaigns.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>List Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Contacts</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactLists.map((list) => (
                        <TableRow key={list.id}>
                          <TableCell className="font-medium">
                            {list.name}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {list.description || 'No description'}
                          </TableCell>
                          <TableCell>
                            <Badge>{list.contactIds.length}</Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(list.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditContactList(list)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteContactList(list.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge-base">
          <PDFUploader onPDFUploaded={uploadKnowledgeBase} />
          <KnowledgeBaseList 
            knowledgeBases={knowledgeBases}
            onDeleteKnowledgeBase={deleteKnowledgeBase}
          />
        </TabsContent>
      </Tabs>

      {/* Contact List Creation/Edit Dialog */}
      <Dialog open={isContactListDialogOpen} onOpenChange={setIsContactListDialogOpen}>
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Select Contacts for this List</span>
                </h3>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[250px]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleSelectAllContacts}
                  >
                    {selectedContactIds.length === filteredContacts.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email / Phone</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No contacts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
                        <TableRow 
                          key={contact.id}
                          className="cursor-pointer"
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
                            {contact.position || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Selected {selectedContactIds.length} of {filteredContacts.length} contacts
                {searchQuery && ` (filtered from ${contacts.length} total)`}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContactList}>
              {editingContactList ? "Update List" : "Create List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
