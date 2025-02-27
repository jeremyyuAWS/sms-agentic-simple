
import React, { useState } from 'react';
import CSVUploader from '../components/contacts/CSVUploader';
import { Contact } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  const handleContactsUploaded = (newContacts: Contact[]) => {
    setContacts(prevContacts => [...prevContacts, ...newContacts]);
    
    toast({
      title: 'Contacts Uploaded',
      description: `${newContacts.length} contacts have been added to your database.`,
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Contacts</h1>
        <p className="text-muted-foreground">
          Upload and manage your contact lists for SMS campaigns.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Import Contacts</h2>
        <CSVUploader onContactsUploaded={handleContactsUploaded} />
      </div>

      {contacts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Contacts ({contacts.length})</h2>
          <p className="text-muted-foreground">
            Contact management features coming soon...
          </p>
        </div>
      )}
    </div>
  );
};

export default Contacts;
