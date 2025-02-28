
import { useState } from 'react';
import { ContactList } from '@/lib/types';

export const createContactListActions = (
  setContactLists: React.Dispatch<React.SetStateAction<ContactList[]>>
) => {
  // Contact list actions
  const createContactList = (list: Omit<ContactList, 'id' | 'createdAt'>) => {
    const newList: ContactList = {
      ...list,
      id: `list-${Date.now()}`,
      createdAt: new Date()
    };
    setContactLists(prev => [...prev, newList]);
  };

  const updateContactList = (id: string, updates: Partial<Omit<ContactList, 'id' | 'createdAt'>>) => {
    setContactLists(prev => prev.map(list => 
      list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list
    ));
  };

  const deleteContactList = (id: string) => {
    setContactLists(prev => prev.filter(list => list.id !== id));
  };

  return {
    createContactList,
    updateContactList,
    deleteContactList
  };
};
