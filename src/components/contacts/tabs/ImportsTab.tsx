
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ListFilter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Contact } from '@/lib/types';

interface ImportGroup {
  groupName: string;
  groupContacts: Contact[];
}

interface ImportsTabProps {
  sortedGroups: [string, Contact[]][];
  onCreateList: (sourceKey: string) => void;
  onDeleteImport: (batchId: string, name: string) => void;
}

const ImportsTab: React.FC<ImportsTabProps> = ({
  sortedGroups,
  onCreateList,
  onDeleteImport
}) => {
  return (
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCreateList(groupName)}
                        >
                          Create List
                        </Button>
                        
                        {groupContacts[0]?.source?.batchId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onDeleteImport(
                              groupContacts[0].source.batchId,
                              groupName
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
  );
};

export default ImportsTab;
