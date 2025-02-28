
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Mail, Edit, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';

const CampaignsEnhanced = () => {
  const { campaigns, updateCampaignStatus } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  
  // Filter campaigns by status
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'paused');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  // Calculate total contacts in all campaigns
  const totalContacts = campaigns.reduce((sum, campaign) => sum + campaign.contactCount, 0);

  // Function to view campaign details
  const viewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetails(true);
  };

  // Function to handle campaign status change
  const handleUpdateStatus = (campaignId: string, newStatus: Campaign['status']) => {
    updateCampaignStatus(campaignId, newStatus);
    
    // Refresh the selected campaign data if needed
    if (selectedCampaign && selectedCampaign.id === campaignId) {
      const updatedCampaign = campaigns.find(c => c.id === campaignId);
      if (updatedCampaign) {
        setSelectedCampaign(updatedCampaign);
      }
    }
  };

  // Function to get the color class based on campaign status
  const getStatusColorClass = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Function to get icon based on campaign status
  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 mr-1" />;
      case 'active':
        return <Check className="h-4 w-4 mr-1" />;
      case 'paused':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'completed':
        return <Check className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage outreach campaigns with automated follow-up sequences.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeCampaigns.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Contacts</p>
                <p className="text-2xl font-bold">{totalContacts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Tabs */}
      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="relative">
            Active
            {activeCampaigns.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{activeCampaigns.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="draft" className="relative">
            Draft
            {draftCampaigns.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{draftCampaigns.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            {completedCampaigns.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{completedCampaigns.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Active Campaigns Tab */}
        <TabsContent value="active" className="mt-0">
          {activeCampaigns.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full p-3 bg-primary/10 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Active Campaigns</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Start a campaign by activating one of your draft campaigns or creating a new one.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activeCampaigns.map(campaign => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColorClass(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground mb-4">
                      {campaign.description || 'No description provided.'}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                        <p className="text-sm font-medium">{campaign.contactCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Messages Sent</p>
                        <p className="text-sm font-medium">{campaign.messagesSent || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                        <p className="text-sm font-medium">{campaign.responseRate ? `${campaign.responseRate}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Started</p>
                        <p className="text-sm font-medium">{campaign.startedAt ? format(new Date(campaign.startedAt), 'MMM d, yyyy') : 'Not started'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.followUps && campaign.followUps.length > 0 && (
                        <Badge variant="outline" className="bg-blue-50">
                          {campaign.followUps.length} follow-up{campaign.followUps.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {campaign.knowledgeBaseId && (
                        <Badge variant="outline" className="bg-purple-50">
                          With Knowledge Base
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Created {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(campaign.id, 'paused')}
                        >
                          Pause
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(campaign.id, 'active')}
                        >
                          Resume
                        </Button>
                      )}
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => viewCampaignDetails(campaign)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Draft Campaigns Tab */}
        <TabsContent value="draft" className="mt-0">
          {draftCampaigns.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full p-3 bg-primary/10 mb-4">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Draft Campaigns</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Start by creating a new campaign to set up your outreach sequence.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {draftCampaigns.map(campaign => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColorClass(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground mb-4">
                      {campaign.description || 'No description provided.'}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                        <p className="text-sm font-medium">{campaign.contactCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Template</p>
                        <p className="text-sm font-medium truncate">{campaign.templateId ? "Selected" : "None"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Follow-ups</p>
                        <p className="text-sm font-medium">{campaign.followUps?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Created</p>
                        <p className="text-sm font-medium">{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {campaign.followUps && campaign.followUps.length > 0 
                        ? `${campaign.followUps.length} follow-up message${campaign.followUps.length !== 1 ? 's' : ''} configured` 
                        : 'No follow-up messages configured'}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewCampaignDetails(campaign)}
                      >
                        Edit Campaign
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(campaign.id, 'active')}
                      >
                        Activate
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Campaigns Tab */}
        <TabsContent value="completed" className="mt-0">
          {completedCampaigns.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full p-3 bg-primary/10 mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Completed Campaigns</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Your completed campaigns will appear here. Start by creating and running a campaign.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {completedCampaigns.map(campaign => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColorClass(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground mb-4">
                      {campaign.description || 'No description provided.'}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                        <p className="text-sm font-medium">{campaign.contactCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Messages Sent</p>
                        <p className="text-sm font-medium">{campaign.messagesSent || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                        <p className="text-sm font-medium">{campaign.responseRate ? `${campaign.responseRate}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Completed</p>
                        <p className="text-sm font-medium">{campaign.completedAt ? format(new Date(campaign.completedAt), 'MMM d, yyyy') : 'Unknown'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Campaign completed {campaign.completedAt ? format(new Date(campaign.completedAt), 'MMM d, yyyy') : 'on unknown date'}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewCampaignDetails(campaign)}
                    >
                      View Summary
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <CampaignCreator 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />

      {/* Campaign Details Dialog */}
      <Dialog open={showCampaignDetails} onOpenChange={setShowCampaignDetails}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedCampaign && (
            <CampaignDetailView
              campaign={selectedCampaign}
              onClose={() => setShowCampaignDetails(false)}
              onStatusChange={handleUpdateStatus}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsEnhanced;
