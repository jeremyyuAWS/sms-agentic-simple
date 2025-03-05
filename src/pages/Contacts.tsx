
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Contact, ContactList } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookUser, Import, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavigationButtons from '@/components/ui/navigation-buttons';

// Import our refactored components
import PageHeader from '@/components/contacts/PageHeader';
import ContactsTab from '@/components/contacts/tabs/ContactsTab';
import ImportsTab from '@/components/contacts/tabs/ImportsTab';
import ListsTab from '@/components/contacts/tabs/ListsTab';
import ContactListDialog from '@/components/contacts/dialogs/ContactListDialog';
import DeleteImportDialog from '@/components/contacts/dialogs/DeleteImportDialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingImportId, setDeletingImportId] = useState<string | null>(null);
  const [deletingImportName, setDeletingImportName] = useState('');

  // Group contacts by their source
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

  const handleCreateContactList = (name: string, description: string, contactIds: string[]) => {
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your contact list.",
        variant: "destructive"
      });
      return;
    }

    if (contactIds.length === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one contact for your list.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingContactList) {
      updateContactList(editingContactList.id, {
        name,
        description,
        contactIds
      });
      
      toast({
        title: "Contact List Updated",
        description: `Successfully updated "${name}" with ${contactIds.length} contacts.`
      });
    } else {
      createContactList({
        name,
        description,
        contactIds,
        source: 'manual'
      });
      
      toast({
        title: "Contact List Created",
        description: `Successfully created "${name}" with ${contactIds.length} contacts.`
      });
    }
    
    setEditingContactList(null);
    setIsContactListDialogOpen(false);
  };

  const handleEditContactList = (list: ContactList) => {
    setEditingContactList(list);
    setIsContactListDialogOpen(true);
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
    setIsContactListDialogOpen(true);
  };

  const handleCreateListFromSource = (sourceKey: string) => {
    setEditingContactList(null);
    setIsContactListDialogOpen(true);
  };

  const handleDeleteImportPrompt = (batchId: string, name: string) => {
    setDeletingImportId(batchId);
    setDeletingImportName(name);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteImport = (deleteWithContacts: boolean) => {
    if (!deletingImportId) return;
    
    if (deleteContactImport) {
      deleteContactImport(deletingImportId, deleteWithContacts);
    }
    
    setDeletingImportId(null);
    setDeletingImportName('');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader onCreateList={handleOpenNewListDialog} />

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
          <ContactsTab 
            contacts={contacts} 
            onContactsUploaded={handleContactsUploaded} 
          />
        </TabsContent>

        <TabsContent value="imports">
          <ImportsTab 
            sortedGroups={sortedGroups}
            onCreateList={handleCreateListFromSource}
            onDeleteImport={handleDeleteImportPrompt}
          />
        </TabsContent>

        <TabsContent value="lists">
          <ListsTab 
            contactLists={contactLists}
            onCreateList={handleOpenNewListDialog}
            onEditList={handleEditContactList}
            onDeleteList={handleDeleteContactList}
          />
        </TabsContent>
      </Tabs>

      <NavigationButtons currentPage="contacts" />

      {/* Dialogs */}
      <ContactListDialog 
        isOpen={isContactListDialogOpen}
        onOpenChange={setIsContactListDialogOpen}
        contacts={contacts}
        editingContactList={editingContactList}
        onCreateList={handleCreateContactList}
        groupedContacts={groupedContacts}
        sortedGroups={sortedGroups}
      />

      <DeleteImportDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deletingImportName={deletingImportName}
        onConfirmDelete={handleConfirmDeleteImport}
      />
    </div>
  );
};

export default Contacts;
