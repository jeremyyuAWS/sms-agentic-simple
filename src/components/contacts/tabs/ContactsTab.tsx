
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Import, Info } from 'lucide-react';
import CSVUploader from '@/components/contacts/CSVUploader';
import { Contact } from '@/lib/types';

interface ContactsTabProps {
  contacts: Contact[];
  onContactsUploaded: (
    newContacts: Contact[], 
    source: {
      type: 'csv' | 'manual' | 'import' | 'api';
      name: string;
      filename?: string;
    }
  ) => void;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ 
  contacts, 
  onContactsUploaded 
}) => {
  return (
    <>
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
          <CSVUploader onContactsUploaded={onContactsUploaded} />
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
    </>
  );
};

export default ContactsTab;
