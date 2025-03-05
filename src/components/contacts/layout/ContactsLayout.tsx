
import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookUser, Import, List } from 'lucide-react';
import { useContacts } from '@/hooks/use-contacts';
import PageHeader from '../PageHeader';
import ContactsTab from '../tabs/ContactsTab';
import ImportsTab from '../tabs/ImportsTab';
import ListsTab from '../tabs/ListsTab';
import ContactListDialog from '../dialogs/ContactListDialog';
import DeleteImportDialog from '../dialogs/DeleteImportDialog';
import NavigationButtons from '@/components/ui/navigation-buttons';
import LoadingState from '@/components/ui/loading-state';

const ContactsLayout: React.FC = () => {
  const { 
    activeTabPage, 
    setActiveTabPage,
    contacts,
    contactLists,
    groupedContacts,
    sortedGroups,
    isContactListDialogOpen,
    setIsContactListDialogOpen,
    editingContactList,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingImportName,
    handleContactsUploaded,
    handleCreateContactList,
    handleEditContactList,
    handleDeleteContactList,
    handleCreateListFromSource,
    handleDeleteImportPrompt,
    handleConfirmDeleteImport,
    handleOpenNewListDialog
  } = useContacts();

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader />

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

        <Suspense fallback={<LoadingState isLoading={true} />}>
          <TabsContent value="contacts">
            <ContactsTab onContactsUploaded={handleContactsUploaded} />
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
        </Suspense>
      </Tabs>

      <NavigationButtons currentPage="contacts" />

      {/* Dialogs */}
      <ContactListDialog 
        isOpen={isContactListDialogOpen}
        onOpenChange={setIsContactListDialogOpen}
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

export default ContactsLayout;
