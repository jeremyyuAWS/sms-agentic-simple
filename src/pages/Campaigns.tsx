
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Undo2, ListFilter, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; // Added missing Badge import
import CampaignList from '@/components/campaigns/CampaignList';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import NavigationButtons from '@/components/ui/navigation-buttons';

const Campaigns: React.FC = () => {
  const { 
    campaigns, 
    createCampaign, 
    updateCampaignStatus,
    contacts,
    contactLists,
    templates,
    knowledgeBases,
    updateCampaign,
    deleteCampaign
  } = useApp();
  
  const { toast } = useToast();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateCampaign = (campaignData: any) => {
    try {
      setIsSubmitting(true);
      const newCampaign = createCampaign(campaignData);
      setIsSubmitting(false);
      
      toast({
        title: "Campaign Created",
        description: `Campaign "${campaignData.name}" has been created successfully.`,
        variant: "default"
      });
      
      // Ensure we're checking if newCampaign is not undefined and has an id
      if (newCampaign && typeof newCampaign === 'object' && 'id' in newCampaign) {
        setSelectedCampaignId(newCampaign.id);
        setActiveTab('view');
      }
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error Creating Campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCampaign = (campaignId: string, campaignData: any) => {
    try {
      setIsSubmitting(true);
      // Using the updateCampaign method from context
      updateCampaign(campaignId, campaignData);
      setIsSubmitting(false);
      
      toast({
        title: "Campaign Updated",
        description: `Campaign "${campaignData.name}" has been updated successfully.`,
        variant: "default"
      });
      setActiveTab('view');
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error Updating Campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    try {
      // Using the deleteCampaign method from context
      deleteCampaign(campaignId);
      
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
        variant: "default"
      });
      
      if (selectedCampaignId === campaignId) {
        setSelectedCampaignId(null);
        setActiveTab('list');
      }
    } catch (error) {
      toast({
        title: "Error Deleting Campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('view');
  };

  const handleEditCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('create');
  };

  const handleCreateNew = () => {
    setSelectedCampaignId(null);
    setActiveTab('create');
  };

  const handleBackToList = () => {
    setSelectedCampaignId(null);
    setActiveTab('list');
  };
  
  // Get the selected campaign
  const selectedCampaign = selectedCampaignId
    ? campaigns.find(c => c.id === selectedCampaignId)
    : null;

  // For debugging
  console.log("Current activeTab:", activeTab);
  console.log("Campaigns data:", campaigns);
  console.log("Selected campaign:", selectedCampaign);

  // Organize campaigns by status
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed' || c.status === 'paused');

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your outreach campaigns
          </p>
        </div>
        
        {activeTab === 'list' && (
          <Button onClick={handleCreateNew} className="bg-[#8B5CF6] hover:bg-[#7E69AB]">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        )}
        
        {(activeTab === 'view' || activeTab === 'create') && (
          <Button variant="outline" onClick={handleBackToList}>
            <Undo2 className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="space-y-6">
          {campaigns.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-10">
                <div className="text-center space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <CardTitle>No campaigns yet</CardTitle>
                  <CardDescription className="mx-auto max-w-lg">
                    Create your first campaign to start reaching out to your contacts. Campaigns allow you to send personalized messages and follow-ups automatically.
                  </CardDescription>
                  <Button onClick={handleCreateNew} className="mt-4 bg-[#8B5CF6] hover:bg-[#7E69AB]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Campaigns</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
          
              {/* Active Campaigns */}
              {activeCampaigns.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Active Campaigns
                      </CardTitle>
                      <Badge className="bg-green-500">{activeCampaigns.length}</Badge>
                    </div>
                    <CardDescription>
                      Campaigns that are currently running and sending messages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CampaignList 
                      campaigns={activeCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Draft Campaigns */}
              {draftCampaigns.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-amber-400 mr-2"></span>
                        Draft Campaigns
                      </CardTitle>
                      <Badge className="bg-amber-500">{draftCampaigns.length}</Badge>
                    </div>
                    <CardDescription>
                      Campaigns that are still being set up and not yet active
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CampaignList 
                      campaigns={draftCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Completed & Paused Campaigns */}
              {completedCampaigns.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full bg-slate-400 mr-2"></span>
                        Completed & Paused Campaigns
                      </CardTitle>
                      <Badge className="bg-slate-500">{completedCampaigns.length}</Badge>
                    </div>
                    <CardDescription>
                      Campaigns that have finished or been temporarily paused
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CampaignList 
                      campaigns={completedCampaigns}
                      onSelect={handleViewCampaign}
                      onUpdateStatus={updateCampaignStatus}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
      
      {activeTab === 'create' && (
        <CampaignCreator
          campaign={selectedCampaignId ? selectedCampaign : undefined}
          contacts={contacts}
          contactLists={contactLists}
          templates={templates}
          knowledgeBases={knowledgeBases}
          onCreateCampaign={handleCreateCampaign}
          onUpdateCampaign={handleUpdateCampaign}
          onCancel={handleBackToList}
          isSubmitting={isSubmitting}
        />
      )}
      
      {activeTab === 'view' && selectedCampaign && (
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

export default Campaigns;
