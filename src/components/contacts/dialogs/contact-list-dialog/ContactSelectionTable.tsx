
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contact } from '@/lib/types';

interface ContactSelectionTableProps {
  filteredContacts: Contact[];
  selectedContactIds: string[];
  selectedSourceFilter: string;
  toggleContactSelection: (contactId: string) => void;
}

const ContactSelectionTable: React.FC<ContactSelectionTableProps> = ({
  filteredContacts,
  selectedContactIds,
  selectedSourceFilter,
  toggleContactSelection
}) => {
  return (
    <div className="border rounded-md h-[400px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email / Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="mb-2">No contacts found with the current filters.</div>
                  {selectedSourceFilter !== 'all' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                    >
                      Show all contacts
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredContacts.map((contact) => (
              <TableRow 
                key={contact.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleContactSelection(contact.id)}
              >
                <TableCell className="align-middle">
                  <input
                    type="checkbox"
                    checked={selectedContactIds.includes(contact.id)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {contact.name}
                </TableCell>
                <TableCell>
                  {contact.email || contact.phoneNumber}
                </TableCell>
                <TableCell>
                  {contact.company || '-'}
                </TableCell>
                <TableCell>
                  {contact.source ? (
                    <Badge variant="outline" className="capitalize">
                      {contact.source.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">
                      Untracked
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactSelectionTable;
