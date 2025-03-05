import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Contact, ContactList } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookUser, FileText, Import, Info, ListFilter, Users, Plus, Edit, Trash2, List, Filter, X, AlertCircle } from 'lucide-react';
import CSVUploader from '@/components/contacts/CSVUploader';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import NavigationButtons from '@/components/ui/navigation-buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Contacts: React.FC = () => {
  const { 
    contacts, 
    uploadContacts, 
    contactLists,
    createContactList,
    updateContactList,
    deleteContactList,
    deleteContactImport
  } = useApp();
  
  const { toast } = useToast();
  const [activeTabPage, setActiveTabPage] = useState('contacts');
  const [isContactListDialogOpen, setIsContactListDialogOpen] = useState(false);
  const [editingContactList, setEditingContactList] = useState<ContactList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingImportId, setDeletingImportId] = useState<string | null>(null);
  const [deleteImportWithContacts, setDeleteImportWithContacts] = useState(false);
  const [deletingImportName, setDeletingImportName] = useState('');

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

  const groupedContacts = contacts.reduce((groups, contact) => {
    if (!contact.source) {
      const key = 'Untracked';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    } else {
      const key = contact.source.name;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    }
    return groups;
  }, {} as Record<string, Contact[]>);

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
    
    setNewListName('');
    setNewListDescription('');
    setSelectedContactIds([]);
    setEditingContactList(null);
    setIsContactListDialogOpen(false);
    setSelectedSourceFilter('all');
  };

  const handleEditContactList = (list: ContactList) => {
    setEditingContactList(list);
    setNewListName(list.name);
    setNewListDescription(list.description || '');
    setSelectedContactIds([...list.contactIds]);
    setIsContactListDialogOpen(true);
    setSelectedSourceFilter('all');
  };

  const handleDeleteContactList = (listId: string) => {
    if (confirm("Are you sure you want to delete this contact list? This action cannot be undone.")) {
      deleteContactList(listId);
      
      toast({
        title: "Contact List Deleted",
        description: "The contact list has been removed. Individual contacts remain in the system."
      });
    }
  };

  const handleOpenNewListDialog = () => {
    setEditingContactList(null);
    setNewListName('');
    setNewListDescription('');
    setSelectedContactIds([]);
    setIsContactListDialogOpen(true);
    setSelectedSourceFilter('all');
  };

  const handleDeleteImportPrompt = (batchId: string, name: string) => {
    setDeletingImportId(batchId);
    setDeletingImportName(name);
    setDeleteImportWithContacts(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteImport = () => {
    if (!deletingImportId) return;
    
    if (deleteContactImport) {
      deleteContactImport(deletingImportId, deleteImportWithContacts);
    }
    
    setDeletingImportId(null);
    setDeletingImportName('');
    setIsDeleteDialogOpen(false);
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

  const handleSourceFilterChange = (sourceKey: string) => {
    setSelectedSourceFilter(sourceKey);
    
    if (!editingContactList && !newListName.trim() && sourceKey !== 'all' && sourceKey !== 'untracked') {
      setNewListName(`Contacts from "${sourceKey}"`);
    }
    
    setSelectedContactIds([]);
  };

  const getSourceCount = (sourceKey: string): number => {
    if (sourceKey === 'all') return contacts.length;
    if (sourceKey === 'untracked') {
      return contacts.filter(c => !c.source).length;
    }
    return groupedContacts[sourceKey]?.length || 0;
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and contact lists
          </p>
        </div>
        
        <Button onClick={handleOpenNewListDialog} className="bg-[#8B5CF6] hover:bg-[#7E69AB]">
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
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
                        <TableHead className="text-right">Actions</TableHead>
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
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSourceFilter(groupName);
                                  setNewListName(`Contacts from "${groupName}"`);
                                  setIsContactListDialogOpen(true);
                                }}
                              >
                                Create List
                              </Button>
                              
                              {groupContacts[0]?.source?.batchId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteImportPrompt(
                                    groupContacts[0].source.batchId,
                                    groupName
                                  )}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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
      </Tabs>

      <NavigationButtons currentPage="contacts" />

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
            <Button variant="outline" onClick={() => setIsContactListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContactList} disabled={selectedContactIds.length === 0 || !newListName.trim()}>
              {editingContactList ? "Update List" : "Create List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Import History
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the import "{deletingImportName}"?
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-amber-800 text-sm">
                    <p className="font-medium">Note about contacts</p>
                    <p className="mt-1">
                      You can choose to keep the contacts in your database or delete them along with the import history.
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteContacts"
                checked={deleteImportWithContacts}
                onChange={(e) => setDeleteImportWithContacts(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="deleteContacts" className="text-sm font-medium text-gray-900">
                Also delete contacts from this import
              </label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImport}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteImportWithContacts 
                ? "Delete Import & Contacts" 
                : "Delete Import Only"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Contacts;
