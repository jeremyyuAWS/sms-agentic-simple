
import React from 'react';
import { ContactsProvider } from '@/components/contacts/context/ContactsContext';
import ContactsLayout from '@/components/contacts/layout/ContactsLayout';

const Contacts: React.FC = () => {
  return (
    <ContactsProvider>
      <ContactsLayout />
    </ContactsProvider>
  );
};

export default Contacts;
