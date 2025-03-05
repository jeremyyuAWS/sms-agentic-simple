
import { useContactsContext } from '@/components/contacts/context/ContactsContext';
import { useApp } from '@/contexts';

export const useContacts = () => {
  const contactsContext = useContactsContext();
  const { contacts, contactLists } = useApp();
  
  return {
    ...contactsContext,
    contacts,
    contactLists
  };
};
