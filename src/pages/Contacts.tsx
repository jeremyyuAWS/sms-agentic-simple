
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Contact } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookUser, FileText, Import, Info, ListFilter } from 'lucide-react';
import CSVUploader from '@/components/contacts/CSVUploader';
import PDFUploader from '@/components/contacts/PDFUploader';
import KnowledgeBaseList from '@/components/contacts/KnowledgeBaseList';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

const Contacts: React.FC = () => {
  const { 
    contacts, 
    uploadContacts, 
    knowledgeBases,
    uploadKnowledgeBase,
    deleteKnowledgeBase
  } = useApp();
  
  const [activeTabPage, setActiveTabPage] = useState('contacts');

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

  // Group contacts by their source
  const groupedContacts = contacts.reduce((groups, contact) => {
    if (!contact.source) {
      // Group contacts with no source as "Untracked"
      const key = 'Untracked';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    } else {
      // Group by import batch name
      const key = contact.source.name;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(contact);
    }
    return groups;
  }, {} as Record<string, Contact[]>);

  // Sort groups by date (newest first) or alphabetically if no date
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

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contacts & Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Manage your contacts and campaign knowledge base files
        </p>
      </div>

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
                Upload a CSV file with your contacts information. Contacts will be added to your central contact pool.
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

        <TabsContent value="imports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-primary" />
                Import History
              </CardTitle>
              <CardDescription>
                View all contact import batches and manage your contact pool
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No contact imports yet. Upload contacts first.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Import Name</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Contacts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedGroups.map(([groupName, groupContacts]) => (
                        <TableRow key={groupName}>
                          <TableCell className="font-medium">
                            {groupName}
                          </TableCell>
                          <TableCell>
                            {groupContacts[0]?.source?.type ? (
                              <Badge variant="outline" className="capitalize">
                                {groupContacts[0]?.source?.type || 'unknown'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100">
                                Untracked
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {groupContacts[0]?.source?.importedAt ? (
                              format(new Date(groupContacts[0].source.importedAt), 'MMM d, yyyy h:mm a')
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge>{groupContacts.length}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>
                      All contacts are stored in a central contact pool. When creating campaigns, 
                      you can filter contacts by their import batch, tags, or other properties.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
