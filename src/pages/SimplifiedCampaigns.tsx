
import React, { useState, useCallback } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Undo2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CampaignList from '@/components/campaigns/CampaignList';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import NavigationButtons from '@/components/ui/navigation-buttons';
import CampaignFilters from '@/components/campaigns/CampaignFilters';
import { Campaign } from '@/lib/types';
import LoadingState from '@/components/ui/loading-state';
import { useCampaignFilters } from '@/hooks/use-campaign-filters';
import SimplifiedCampaignCreator from '@/components/campaigns/SimplifiedCampaignCreator';

type CampaignView = 'list' | 'create' | 'detail';

const SimplifiedCampaigns: React.FC = () => {
  const { 
    campaigns, 
    updateCampaignStatus,
    updateCampaign,
    deleteCampaign,
  } = useApp();
  
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<CampaignView>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Use our custom filters hook
  const {
    activeStatus,
    sortBy,
    searchQuery,
    filteredCampaigns,
    statusCounts,
    setActiveStatus,
    setSortBy,
    setSearchQuery
  } = useCampaignFilters(campaigns);

  // Get the selected campaign
  const selectedCampaign = selectedCampaignId 
    ? campaigns.find(c => c.id === selectedCampaignId) 
    : null;

  // Event handlers
  const handleNewCampaign = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('create');
    setApiError(null);
  }, []);

  const handleViewCampaign = useCallback((campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('detail');
    setApiError(null);
  }, []);

  const handleEditCampaign = useCallback((campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedView('create');
    setApiError(null);
  }, []);

  const handleDeleteCampaign = useCallback((campaignId: string) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      deleteCampaign(campaignId);
      
      if (selectedCampaignId === campaignId) {
        setSelectedCampaignId(null);
        setSelectedView('list');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to delete campaign";
      setApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [deleteCampaign, selectedCampaignId]);

  const handleBackToList = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('list');
    setApiError(null);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setActiveStatus(status as any);
  }, [setActiveStatus]);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort as any);
  }, [setSortBy]);

  const handleCampaignCreated = useCallback(() => {
    setSelectedView('list');
    setApiError(null);
  }, []);

  // Render the appropriate view
  const renderContent = () => {
    if (selectedView === 'create') {
      return (
        <SimplifiedCampaignCreator
          onCancel={handleBackToList}
          onComplete={handleCampaignCreated}
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
      <LoadingState isLoading={isLoading} error={apiError}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        
          <CampaignFilters 
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
            totalCount={statusCounts.all}
          />
          
          <CampaignList 
            campaigns={filteredCampaigns}
            onSelect={handleViewCampaign}
            onUpdateStatus={updateCampaignStatus}
            onEdit={handleEditCampaign}
            onDelete={handleDeleteCampaign}
          />
        </div>
      </LoadingState>
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
        
        {selectedView !== 'list' && selectedView !== 'create' && (
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

export default SimplifiedCampaigns;
