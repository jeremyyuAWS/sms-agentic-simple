
import React, { createContext, useContext, useState } from 'react';
import { Contact, ContactList } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts';

interface ContactsContextProps {
  activeTabPage: string;
  setActiveTabPage: (tab: string) => void;
  isContactListDialogOpen: boolean;
  setIsContactListDialogOpen: (open: boolean) => void;
  editingContactList: ContactList | null;
  setEditingContactList: (list: ContactList | null) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  deletingImportId: string | null;
  setDeletingImportId: (id: string | null) => void;
  deletingImportName: string;
  setDeletingImportName: (name: string) => void;
  groupedContacts: Record<string, Contact[]>;
  sortedGroups: [string, Contact[]][];
  handleContactsUploaded: (
    newContacts: Contact[], 
    source: {
      type: 'csv' | 'manual' | 'import' | 'api';
      name: string;
      filename?: string;
    }
  ) => void;
  handleCreateContactList: (name: string, description: string, contactIds: string[]) => void;
  handleEditContactList: (list: ContactList) => void;
  handleDeleteContactList: (listId: string) => void;
  handleOpenNewListDialog: () => void;
  handleCreateListFromSource: (sourceKey: string) => void;
  handleDeleteImportPrompt: (batchId: string, name: string) => void;
  handleConfirmDeleteImport: (deleteWithContacts: boolean) => void;
}

export const ContactsContext = createContext<ContactsContextProps | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const value = {
    activeTabPage,
    setActiveTabPage,
    isContactListDialogOpen,
    setIsContactListDialogOpen,
    editingContactList,
    setEditingContactList,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingImportId,
    setDeletingImportId,
    deletingImportName,
    setDeletingImportName,
    groupedContacts,
    sortedGroups,
    handleContactsUploaded,
    handleCreateContactList,
    handleEditContactList,
    handleDeleteContactList,
    handleOpenNewListDialog,
    handleCreateListFromSource,
    handleDeleteImportPrompt,
    handleConfirmDeleteImport,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactsContext = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContactsContext must be used within a ContactsProvider');
  }
  return context;
};
