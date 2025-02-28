
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Contact } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookUser, FileText, Import, Info } from 'lucide-react';
import CSVUploader from '@/components/contacts/CSVUploader';
import PDFUploader from '@/components/contacts/PDFUploader';
import KnowledgeBaseList from '@/components/contacts/KnowledgeBaseList';

const Contacts: React.FC = () => {
  const { 
    contacts, 
    uploadContacts, 
    knowledgeBases,
    uploadKnowledgeBase,
    deleteKnowledgeBase
  } = useApp();

  const handleContactsUploaded = (newContacts: Contact[]) => {
    uploadContacts(newContacts);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contacts & Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Manage your contacts and campaign knowledge base files
        </p>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="mb-6">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <BookUser className="h-4 w-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Knowledge Base</span>
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
                Upload a CSV file with your contacts information.
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

        <TabsContent value="knowledge-base">
          <PDFUploader onPDFUploaded={uploadKnowledgeBase} />
          <KnowledgeBaseList 
            knowledgeBases={knowledgeBases}
            onDeleteKnowledgeBase={deleteKnowledgeBase}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contacts;
