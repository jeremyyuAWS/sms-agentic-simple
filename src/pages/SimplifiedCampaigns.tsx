
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
import SimplifiedCampaignTypeGrid from '@/components/campaigns/SimplifiedCampaignTypeGrid';
import { CampaignType } from '@/components/campaigns/CampaignTypeSelector';

type CampaignView = 'list' | 'create' | 'detail' | 'type-selection';

const SimplifiedCampaigns: React.FC = () => {
  const { 
    campaigns, 
    updateCampaignStatus,
    updateCampaign,
    deleteCampaign,
  } = useApp();
  
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<CampaignView>('type-selection');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null);

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
  const handleSelectCampaignType = useCallback((type: CampaignType) => {
    setSelectedCampaignType(type);
    setSelectedView('create');
    setApiError(null);
  }, []);

  const handleNewCampaign = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('type-selection');
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
        setSelectedView('type-selection');
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

  const handleBackToTypeSelection = useCallback(() => {
    setSelectedCampaignId(null);
    setSelectedView('type-selection');
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
    if (selectedView === 'type-selection') {
      return campaigns.length === 0 ? (
        <div className="space-y-8 px-4 sm:px-6">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">Welcome to the SMS Campaign Creator</h2>
            <p className="text-muted-foreground">
              Create your first campaign by selecting a campaign type below. Each tile represents a different 
              outreach scenario with pre-configured templates and settings.
            </p>
          </div>
          <SimplifiedCampaignTypeGrid onSelect={handleSelectCampaignType} />
        </div>
      ) : (
        <div className="space-y-8 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Existing Campaigns</h2>
            <Button 
              variant="outline" 
              onClick={() => setSelectedView('list')}
              className="text-sm"
            >
              View All Campaigns
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.slice(0, 3).map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-md cursor-pointer transition-all" onClick={() => handleViewCampaign(campaign.id)}>
                <div className="h-2 bg-purple-100 w-full"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description || 'No description'}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <SimplifiedCampaignTypeGrid onSelect={handleSelectCampaignType} />
        </div>
      );
    }
    
    if (selectedView === 'create') {
      return (
        <div className="px-4 sm:px-6">
          <SimplifiedCampaignCreator
            initialCampaignType={selectedCampaignType}
            onCancel={handleBackToTypeSelection}
            onComplete={handleCampaignCreated}
          />
        </div>
      );
    }
    
    if (selectedView === 'detail' && selectedCampaign) {
      return (
        <div className="px-4 sm:px-6">
          <CampaignDetailView
            campaign={selectedCampaign}
            onClose={handleBackToTypeSelection}
            onStatusChange={updateCampaignStatus}
            onEdit={handleEditCampaign}
          />
        </div>
      );
    }
    
    // Default to list view
    return (
      <LoadingState isLoading={isLoading} error={apiError}>
        <div className="space-y-4 px-4 sm:px-6">
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
            <Button 
              onClick={handleBackToTypeSelection}
              className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
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
      <div className="flex justify-between items-center mb-6 px-4 sm:px-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">SMS Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated outreach campaigns
          </p>
        </div>
        
        {/* Removed duplicate New Campaign button - only show in list view */}
        {selectedView === 'list' && (
          <Button 
            onClick={handleBackToTypeSelection} /* Changed to direct to type selection */
            className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Campaign</span>
          </Button>
        )}
        
        {selectedView !== 'list' && selectedView !== 'type-selection' && (
          <Button variant="outline" onClick={handleBackToTypeSelection} className="text-sm">
            <Undo2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Campaign Types</span>
          </Button>
        )}
      </div>

      {renderContent()}
      
      {/* Navigation Buttons */}
      <div className="mt-12">
        <NavigationButtons currentPage="simplified-campaigns" />
      </div>
    </div>
  );
};

export default SimplifiedCampaigns;
