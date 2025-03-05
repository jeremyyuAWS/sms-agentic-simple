
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { List, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { ContactList } from '@/lib/types';

interface ListsTabProps {
  contactLists: ContactList[];
  onCreateList: () => void;
  onEditList: (list: ContactList) => void;
  onDeleteList: (listId: string) => void;
}

const ListsTab: React.FC<ListsTabProps> = ({
  contactLists,
  onCreateList,
  onEditList,
  onDeleteList
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            Contact Lists
          </CardTitle>
          <CardDescription>
            Create and manage contact lists for your campaigns
          </CardDescription>
        </div>
        <Button onClick={onCreateList} className="bg-[#8B5CF6] hover:bg-[#7E69AB]">
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </CardHeader>
      <CardContent>
        {contactLists.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contact lists yet. Create your first list to organize contacts for campaigns.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>List Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Contacts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">
                      {list.name}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {list.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Badge>{list.contactIds.length}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(list.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditList(list)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteList(list.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListsTab;
