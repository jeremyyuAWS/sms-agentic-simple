import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Campaign } from '@/lib/types';
import { useApp } from '@/contexts';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SimplifiedCampaignCreator from '@/components/campaigns/SimplifiedCampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import CampaignList from '@/components/campaigns/CampaignList';
import { CampaignType } from '@/components/campaigns/types/campaignTypes';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

const PageTitle = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default function SimplifiedCampaigns() {
  const { campaigns, updateCampaignStatus, createCampaign, updateCampaign } = useApp();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const selectedCampaign = selectedCampaignId 
    ? campaigns.find(c => c.id === selectedCampaignId) 
    : null;
  
  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
  };
  
  const handleCampaignSelect = (campaignId: string, defaultTab: string = 'overview') => {
    setSelectedCampaignId(campaignId);
  };
  
  const handleStatusChange = (campaignId: string, status: Campaign['status']) => {
    updateCampaignStatus(campaignId, status);
  };
  
  const handleEdit = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign && campaign.status !== 'completed') {
      setSelectedCampaignId(campaignId);
      setIsEditing(true);
    }
  };
  
  const handleClose = () => {
    setSelectedCampaignId(null);
    setIsEditing(false);
  };
  
  const handleComplete = () => {
    setIsCreatingCampaign(false);
    setIsEditing(false);
    setSelectedCampaignId(null);
  };
  
  const handleSaveCampaign = (campaign: Campaign) => {
    if (selectedCampaignId) {
      updateCampaign(campaign);
    } else {
      createCampaign(campaign);
    }
    handleComplete();
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <PageTitle title="Campaigns" subtitle="Create and manage your outreach campaigns" />
          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
        
        <CampaignList 
          campaigns={campaigns}
          onSelect={handleCampaignSelect}
          onUpdateStatus={handleStatusChange}
          onEdit={handleEdit}
        />
        
        <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
          <DialogContent className="max-w-3xl">
            <SimplifiedCampaignCreator 
              onComplete={handleComplete} 
              onCancel={() => setIsCreatingCampaign(false)} 
            />
          </DialogContent>
        </Dialog>
        
        {selectedCampaign && !isEditing && (
          <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CampaignDetailView 
                campaign={selectedCampaign}
                onClose={handleClose}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                defaultTab={selectedCampaign.status === 'completed' ? 'analytics' : undefined}
              />
            </DialogContent>
          </Dialog>
        )}
        
        {selectedCampaign && isEditing && selectedCampaign.status !== 'completed' && (
          <Dialog open={isEditing} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl">
              <SimplifiedCampaignCreator 
                initialCampaignType="sales-outreach" 
                onComplete={handleComplete}
                onCancel={handleClose}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageLayout>
  );
}
