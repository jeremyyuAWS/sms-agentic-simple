
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts';

interface CampaignContactSelectionProps {
  selectedContactIds: string[];
  contactListId?: string;
  segmentId?: string;
  onContactsSelect: (contacts: string[]) => void;
  onListSelect: (listId?: string) => void;
  onSegmentSelect: (segmentId?: string) => void;
}

const CampaignContactSelection: React.FC<CampaignContactSelectionProps> = ({
  selectedContactIds,
  contactListId,
  segmentId,
  onContactsSelect,
  onListSelect,
  onSegmentSelect
}) => {
  const { contacts, contactLists, contactSegments } = useApp();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Contacts</h2>
      <p className="text-muted-foreground">
        Choose contacts for your campaign by selecting individuals, a contact list, or a segment.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contact Lists Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contactLists.map(list => (
                <div 
                  key={list.id}
                  className={`p-2 border rounded cursor-pointer ${
                    contactListId === list.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => onListSelect(list.id)}
                >
                  <div className="font-medium">{list.name}</div>
                  <div className="text-sm text-muted-foreground">{list.contactIds.length} contacts</div>
                </div>
              ))}
              
              {contactLists.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No contact lists available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Segments Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contactSegments?.map(segment => (
                <div 
                  key={segment.id}
                  className={`p-2 border rounded cursor-pointer ${
                    segmentId === segment.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => onSegmentSelect(segment.id)}
                >
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-muted-foreground">{segment.count} contacts</div>
                </div>
              ))}
              
              {(!contactSegments || contactSegments.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  No segments available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Individual Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Select individual contacts for more targeted campaigns
              </p>
              <Button onClick={() => {/* Implement contact selection modal */}}>
                Select Contacts
              </Button>
              
              {selectedContactIds.length > 0 && (
                <div className="mt-4 text-sm">
                  {selectedContactIds.length} contacts selected
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignContactSelection;
