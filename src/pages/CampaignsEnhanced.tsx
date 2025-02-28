
import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Undo2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CampaignList from '@/components/campaigns/CampaignList';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import NavigationButtons from '@/components/ui/navigation-buttons';
import CampaignFilters from '@/components/campaigns/CampaignFilters';
import { Campaign } from '@/lib/types';

type CampaignView = 'list' | 'create' | 'detail';
type StatusFilter = 'all' | 'active' | 'draft' | 'paused' | 'completed';
type SortOption = 'newest' | 'oldest' | 'response' | 'contacts';

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
  const [selectedView, setSelectedView] = useState<CampaignView>('list');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(false);

  // Get the selected campaign
  const selectedCampaign = useMemo(() => 
    selectedCampaignId ? campaigns.find(c => c.id === selectedCampaignId) : null, 
    [selectedCampaignId, campaigns]
  );

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    // First filter by status
    let filtered = activeStatus === 'all' 
      ? campaigns 
      : campaigns.filter(c => {
          if (activeStatus === 'completed') return c.status === 'completed';
          if (activeStatus === 'paused') return c.status === 'paused';
          return c.status === activeStatus;
        });
    
    // Then sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'response':
          return (b.responseRate || 0) - (a.responseRate || 0);
        case 'contacts':
          return (b.contactCount || 0) - (a.contactCount || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [campaigns, activeStatus, sortBy]);

  // Event handlers - use useCallback to prevent recreating functions on each render
  const handleCreateCampaign = useCallback((campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    setIsLoading(true);
    try {
      const newCampaign = createCampaign(campaignData as any);
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
  }, [createCampaign, toast]);

  const handleUpdateCampaign = useCallback((campaignId: string, campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    setIsLoading(true);
    try {
      updateCampaign(campaignId, campaignData);
      toast({
        title: "Campaign Updated!",
        description: `Campaign has been updated successfully.`,
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
  }, [updateCampaign, toast]);

  const handleNewCampaign = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('create');
  }, []);

  const handleViewCampaign = useCallback((campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('detail');
  }, []);

  const handleEditCampaign = useCallback((campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('create');
  }, []);

  const handleDeleteCampaign = useCallback((campaignId: string) => {
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
  }, [deleteCampaign, toast, selectedCampaignId]);

  const handleBackToList = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('list');
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setActiveStatus(status as StatusFilter);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort as SortOption);
  }, []);

  // Render the appropriate view
  const renderContent = () => {
    if (selectedView === 'create') {
      return (
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
      );
    }
    
    if (selectedView === 'detail' && selectedCampaign) {
      return (
        <CampaignDetailView
          campaign={selectedCampaign}
          onClose={handleBackToList}
          onStatusChange={updateCampaignStatus}
          onEdit={handleEditCampaign}
        />
      );
    }
    
    // Default to list view
    if (campaigns.length === 0) {
      return (
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
      );
    }
    
    return (
      <>
        <CampaignFilters 
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          totalCount={campaigns.length}
        />
        
        <CampaignList 
          campaigns={filteredCampaigns}
          onSelect={handleViewCampaign}
          onUpdateStatus={updateCampaignStatus}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
        />
      </>
    );
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

      {renderContent()}
      
      {/* Navigation Buttons */}
      <NavigationButtons currentPage="campaigns" />
    </div>
  );
};

export default CampaignsEnhanced;
