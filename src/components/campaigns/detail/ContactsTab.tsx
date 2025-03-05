
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ContactsTabProps {
  contactsInfo: string;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contactsInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Campaign Contacts</CardTitle>
        <CardDescription>
          {contactsInfo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contact list would go here */}
        <p className="text-muted-foreground">Contact list details...</p>
      </CardContent>
    </Card>
  );
};
