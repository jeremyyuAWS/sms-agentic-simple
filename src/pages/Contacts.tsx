
import React, { useState, useMemo } from 'react';
import CSVUploader from '../components/contacts/CSVUploader';
import { Contact } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Download, Search, Trash2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleContactsUploaded = (newContacts: Contact[]) => {
    setContacts(prevContacts => [...prevContacts, ...newContacts]);
    
    toast({
      title: 'Contacts Uploaded',
      description: `${newContacts.length} contacts have been added to your database.`,
    });
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
    
    toast({
      title: 'Contact Deleted',
      description: 'The contact has been removed from your database.',
    });
  };

  const handleDeleteAllContacts = () => {
    if (contacts.length === 0) return;
    
    setContacts([]);
    toast({
      title: 'All Contacts Deleted',
      description: `${contacts.length} contacts have been removed from your database.`,
    });
  };

  const exportContacts = () => {
    if (contacts.length === 0) {
      toast({
        title: 'Export Failed',
        description: 'There are no contacts to export.',
        variant: 'destructive',
      });
      return;
    }

    // Convert contacts to CSV format
    const headers = ['Name', 'Phone Number', 'Email', 'Company', 'Position'];
    const csvRows = [
      headers.join(','),
      ...contacts.map(contact => 
        [
          `"${contact.name || ''}"`, 
          `"${contact.phoneNumber || ''}"`, 
          `"${contact.email || ''}"`, 
          `"${contact.company || ''}"`, 
          `"${contact.position || ''}"`
        ].join(',')
      )
    ];
    const csvString = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Contacts Exported',
      description: `${contacts.length} contacts have been exported to CSV.`,
    });
  };

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.name?.toLowerCase().includes(term) || 
      contact.phoneNumber?.toLowerCase().includes(term) || 
      contact.email?.toLowerCase().includes(term) || 
      contact.company?.toLowerCase().includes(term) || 
      contact.position?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

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
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Contacts ({filteredContacts.length}/{contacts.length})</h2>
            <div className="flex gap-2">
              <Button onClick={exportContacts} variant="outline" className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              <Button 
                onClick={handleDeleteAllContacts} 
                variant="destructive" 
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2 items-end max-w-sm">
              <div className="flex-1">
                <Label htmlFor="search" className="mb-2">Search Contacts</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="search"
                    placeholder="Search by name, phone, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.phoneNumber}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.company}</TableCell>
                          <TableCell>{contact.position}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UserX className="h-8 w-8 mb-2" />
                            {contacts.length > 0 ? (
                              <p>No contacts match your search criteria</p>
                            ) : (
                              <p>No contacts found</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {contacts.length === 0 && (
        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <UserX size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Contacts Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Upload your first contacts using the CSV uploader above. Your contacts will appear here once uploaded.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contacts;
