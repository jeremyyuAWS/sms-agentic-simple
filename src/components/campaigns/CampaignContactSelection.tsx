
import React, { useState } from 'react';
import { Contact, ContactFilter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Filter, Check, Users, Upload, Tag, UserPlus } from 'lucide-react';
import ContactSelector from '../contacts/ContactSelector';
import { useApp } from '@/contexts';
import { useToast } from '@/hooks/use-toast';

interface CampaignContactSelectionProps {
  selectedContactIds: string[];
  onSelectionChange: (contactIds: string[]) => void;
  segmentId?: string;
  onSegmentChange: (segmentId: string) => void;
  customFilter?: ContactFilter;
  onFilterChange: (filter: ContactFilter | undefined) => void;
}

const CampaignContactSelection: React.FC<CampaignContactSelectionProps> = ({
  selectedContactIds,
  onSelectionChange,
  segmentId,
  onSegmentChange,
  customFilter,
  onFilterChange
}) => {
  const { contacts } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('existing');
  
  const handleImportContacts = () => {
    toast({
      title: "Coming Soon",
      description: "Contact import during campaign creation will be available soon."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Audience</CardTitle>
        <CardDescription>
          Select which contacts to include in this campaign.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="existing" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              <Users className="h-4 w-4 mr-2" />
              Use Existing Contacts
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import New Contacts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4 mt-4">
            <ContactSelector
              selectedContactIds={selectedContactIds}
              onSelectionChange={onSelectionChange}
              segmentId={segmentId}
              onSegmentChange={onSegmentChange}
              customFilter={customFilter}
              onFilterChange={onFilterChange}
            />
          </TabsContent>
          
          <TabsContent value="import" className="mt-4">
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Import New Contacts</h3>
              <p className="text-center text-muted-foreground mb-4">
                Upload a CSV file to import new contacts directly into this campaign.
              </p>
              <Button onClick={handleImportContacts}>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-muted/20 border-t">
        <div className="w-full flex justify-between items-center">
          <div className="text-sm">
            {activeTab === 'existing' && (
              <span>
                {selectedContactIds.length > 0 
                  ? `${selectedContactIds.length} contacts selected`
                  : segmentId 
                    ? "Using segment" 
                    : customFilter 
                      ? "Using filter" 
                      : `All ${contacts.length} contacts included`}
              </span>
            )}
            {activeTab === 'import' && <span>No contacts imported yet</span>}
          </div>
          
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3.5 w-3.5 mr-1" />
            Ready
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignContactSelection;
