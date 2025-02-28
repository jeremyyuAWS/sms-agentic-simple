
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Undo2, Filter, CheckCircle, Calendar, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import CampaignList from '@/components/campaigns/CampaignList';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import NavigationButtons from '@/components/ui/navigation-buttons';

const CampaignsEnhanced: React.FC = () => {
  const { 
    campaigns, 
    createCampaign, 
    updateCampaignStatus,
    updateCampaign,
    deleteCampaign,
    contacts,
    contactLists,
    templates,
    knowledgeBases
  } = useApp();
  
  const { toast } = useToast();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'list' | 'create' | 'detail'>('list');
  const [activeStatus, setActiveStatus] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const selectedCampaign = selectedCampaignId 
    ? campaigns.find(c => c.id === selectedCampaignId) 
    : null;

  // Filter campaigns based on active status
  const filteredCampaigns = activeStatus === 'all' 
    ? campaigns 
    : campaigns.filter(c => {
        if (activeStatus === 'completed') return c.status === 'completed' || c.status === 'paused';
        return c.status === activeStatus;
      });

  const handleCreateCampaign = (campaignData: any) => {
    setIsLoading(true);
    try {
      const newCampaign = createCampaign(campaignData);
      toast({
        title: "Campaign Created!",
        description: `Campaign "${campaignData.name}" has been created successfully.`,
        variant: "default",
      });
      
      setSelectedCampaignId(newCampaign.id);
      setSelectedView('detail');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCampaign = (campaignId: string, campaignData: any) => {
    setIsLoading(true);
    try {
      updateCampaign(campaignId, campaignData);
      toast({
        title: "Campaign Updated!",
        description: `Campaign "${campaignData.name}" has been updated successfully.`,
        variant: "default",
      });
      setSelectedView('detail');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCampaign = () => {
    setSelectedCampaignId(null);
    setSelectedView('create');
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('detail');
  };

  const handleEditCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('create');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    try {
      deleteCampaign(campaignId);
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
        variant: "default"
      });
      
      if (selectedCampaignId === campaignId) {
        setSelectedCampaignId(null);
        setSelectedView('list');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete campaign",
        variant: "destructive"
      });
    }
  };

  const handleBackToList = () => {
    setSelectedCampaignId(null);
    setSelectedView('list');
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated outreach campaigns
          </p>
        </div>
        
        {selectedView === 'list' && (
          <Button 
            onClick={handleNewCampaign}
            className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        )}
        
        {selectedView !== 'list' && (
          <Button variant="outline" onClick={handleBackToList}>
            <Undo2 className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        )}
      </div>

      {selectedView === 'list' && (
        <>
          {campaigns.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-10">
                <div className="text-center space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <CardTitle>No campaigns yet</CardTitle>
                  <CardDescription className="mx-auto max-w-lg">
                    Create your first campaign to start reaching out to your contacts. Campaigns allow you to send personalized messages and follow-ups automatically.
                  </CardDescription>
                  <Button onClick={handleNewCampaign} className="mt-4 bg-[#8B5CF6] hover:bg-[#7E69AB]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Tabs
                  defaultValue="all"
                  value={activeStatus}
                  onValueChange={(value) => setActiveStatus(value as 'all' | 'active' | 'draft' | 'completed')}
                  className="w-full"
                >
                  <div className="flex justify-between items-center">
                    <TabsList>
                      <TabsTrigger value="all">All Campaigns</TabsTrigger>
                      <TabsTrigger value="active" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Active
                      </TabsTrigger>
                      <TabsTrigger value="draft" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Drafts
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                        Completed
                      </TabsTrigger>
                    </TabsList>
                    
                    <Button variant="outline" size="sm" className="ml-auto">
                      <ListFilter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className="mt-4">
                    <CampaignList 
                      campaigns={filteredCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                      onEdit={handleEditCampaign}
                      onDelete={handleDeleteCampaign}
                    />
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-4">
                    <CampaignList 
                      campaigns={filteredCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                      onEdit={handleEditCampaign}
                      onDelete={handleDeleteCampaign}
                    />
                  </TabsContent>
                  
                  <TabsContent value="draft" className="mt-4">
                    <CampaignList 
                      campaigns={filteredCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                      onEdit={handleEditCampaign}
                      onDelete={handleDeleteCampaign}
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-4">
                    <CampaignList 
                      campaigns={filteredCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                      onEdit={handleEditCampaign}
                      onDelete={handleDeleteCampaign}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </>
      )}
      
      {selectedView === 'create' && (
        <CampaignCreator
          onCreateCampaign={handleCreateCampaign}
          onUpdateCampaign={handleUpdateCampaign}
          onCancel={handleBackToList}
          isSubmitting={isLoading}
          campaign={selectedCampaign || undefined}
          contacts={contacts}
          contactLists={contactLists}
          templates={templates}
          knowledgeBases={knowledgeBases}
        />
      )}
      
      {selectedView === 'detail' && selectedCampaign && (
        <CampaignDetailView
          campaign={selectedCampaign}
          onClose={handleBackToList}
          onStatusChange={updateCampaignStatus}
          onEdit={handleEditCampaign}
        />
      )}
      
      {/* Navigation Buttons */}
      <NavigationButtons currentPage="campaigns" />
    </div>
  );
};

export default CampaignsEnhanced;
