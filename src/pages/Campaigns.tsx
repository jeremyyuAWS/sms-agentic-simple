
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign, Template, FollowUp, Contact, KnowledgeBase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Check, X, Calendar, Trash2, ArrowRight, Clock, Users, Tag, Mail, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import CampaignContactSelection from '@/components/campaigns/CampaignContactSelection';
import { Label } from '@/components/ui/label';

const Campaigns = () => {
  const { campaigns, templates, contacts, knowledgeBases, createCampaign, updateCampaignStatus, addFollowUpToCampaign, removeFollowUp } = useApp();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [addingFollowUp, setAddingFollowUp] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState<Partial<FollowUp>>({
    templateId: '',
    delayDays: 2,
    enabled: true,
    condition: 'no-response'
  });
  
  // Create campaign form
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      templateId: '',
      knowledgeBaseId: '',
      contactIds: [] as string[],
    }
  });

  // Function to handle campaign creation
  const handleCreateCampaign = (values: any) => {
    // Count selected contacts
    const contactCount = values.contactIds.length;
    
    if (contactCount === 0) {
      toast({
        title: "Error",
        description: "You need to select at least one contact for the campaign.",
        variant: "destructive"
      });
      return;
    }
    
    if (!values.templateId) {
      toast({
        title: "Error",
        description: "You need to select a template for the initial message.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the campaign
    const newCampaign: Omit<Campaign, 'id' | 'createdAt'> = {
      name: values.name,
      description: values.description,
      status: 'draft',
      contactCount,
      messagesSent: 0,
      responseRate: 0,
      updatedAt: new Date(),
      templateId: values.templateId,
      knowledgeBaseId: values.knowledgeBaseId || undefined,
      contactIds: values.contactIds,
      followUps: []
    };
    
    createCampaign(newCampaign);
    form.reset();
    setIsCreateOpen(false);
    
    toast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully. You can now add follow-up messages."
    });
  };

  // Function to handle adding a follow-up message
  const handleAddFollowUp = () => {
    if (!selectedCampaign) return;
    
    if (!newFollowUp.templateId) {
      toast({
        title: "Error",
        description: "Please select a template for your follow-up message.",
        variant: "destructive"
      });
      return;
    }
    
    // Add follow-up to the campaign
    addFollowUpToCampaign(selectedCampaign.id, {
      templateId: newFollowUp.templateId as string,
      delayDays: newFollowUp.delayDays || 2,
      enabled: true,
      condition: newFollowUp.condition as 'no-response' | 'all'
    });
    
    // Reset the form
    setNewFollowUp({
      templateId: '',
      delayDays: 2,
      enabled: true,
      condition: 'no-response'
    });
    setAddingFollowUp(false);
    
    // Refresh the selected campaign data
    const updatedCampaign = campaigns.find(c => c.id === selectedCampaign.id);
    if (updatedCampaign) {
      setSelectedCampaign(updatedCampaign);
    }
  };

  // Function to handle removing a follow-up
  const handleRemoveFollowUp = (followUpId: string) => {
    if (!selectedCampaign) return;
    
    removeFollowUp(selectedCampaign.id, followUpId);
    
    // Refresh the selected campaign data
    const updatedCampaign = campaigns.find(c => c.id === selectedCampaign.id);
    if (updatedCampaign) {
      setSelectedCampaign(updatedCampaign);
    }
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
    
    toast({
      title: "Status Updated",
      description: `Campaign status changed to ${newStatus}.`
    });
  };

  // Function to get template by ID
  const getTemplateById = (templateId: string): Template | undefined => {
    return templates.find(t => t.id === templateId);
  };

  // Function to get contact by ID
  const getContactById = (contactId: string): Contact | undefined => {
    return contacts.find(c => c.id === contactId);
  };

  // Function to get knowledge base by ID
  const getKnowledgeBaseById = (knowledgeBaseId: string): KnowledgeBase | undefined => {
    return knowledgeBases.find(kb => kb.id === knowledgeBaseId);
  };

  // Function to view campaign details
  const viewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetails(true);
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
        return <Info className="h-4 w-4 mr-1" />;
    }
  };

  // Calculate total contacts in all campaigns
  const totalContacts = campaigns.reduce((sum, campaign) => sum + campaign.contactCount, 0);
  
  // Filter campaigns by status
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'paused');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

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
                <Users className="h-5 w-5 text-blue-600" />
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
                        <p className="text-xs text-muted-foreground mb-1">Initial Template</p>
                        <p className="text-sm font-medium">{campaign.templateId ? getTemplateById(campaign.templateId)?.name || 'Unknown' : 'None'}</p>
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
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new outreach campaign with automated follow-up messages.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateCampaign)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Q2 Sales Outreach" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your campaign a descriptive name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="E.g., Reaching out to leads from the recent conference" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe the purpose of this campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Message Template</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template for the first message" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.length === 0 ? (
                          <SelectItem value="no-templates" disabled>
                            No templates available. Create one first.
                          </SelectItem>
                        ) : (
                          templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This is the first message that will be sent to your contacts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {knowledgeBases.length > 0 && (
                <FormField
                  control={form.control}
                  name="knowledgeBaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Knowledge Base (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a knowledge base (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {knowledgeBases.map(kb => (
                            <SelectItem key={kb.id} value={kb.id}>
                              {kb.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Attach a knowledge base to provide context for this campaign.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="contactIds"
                render={({ field }) => (
                  <FormItem className="border rounded-md p-4">
                    <FormLabel className="text-base">Select Contacts</FormLabel>
                    <FormDescription className="mt-1 mb-3">
                      Choose the contacts that will receive messages in this campaign.
                    </FormDescription>
                    <FormControl>
                      <CampaignContactSelection
                        contacts={contacts}
                        selectedContactIds={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Campaign
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog open={showCampaignDetails} onOpenChange={setShowCampaignDetails}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">{selectedCampaign?.name}</DialogTitle>
              <Badge variant="outline" className={selectedCampaign ? getStatusColorClass(selectedCampaign.status) : ''}>
                {selectedCampaign && getStatusIcon(selectedCampaign.status)}
                {selectedCampaign?.status}
              </Badge>
            </div>
            <DialogDescription>
              {selectedCampaign?.description || 'No description provided.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="py-4 space-y-6">
              {/* Campaign Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                    <p className="text-lg font-semibold">{selectedCampaign.contactCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Messages Sent</p>
                    <p className="text-lg font-semibold">{selectedCampaign.messagesSent || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                    <p className="text-lg font-semibold">{selectedCampaign.responseRate ? `${selectedCampaign.responseRate}%` : 'N/A'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-lg font-semibold">{format(new Date(selectedCampaign.createdAt), 'MMM d, yyyy')}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Initial Message */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Initial Message</h3>
                {selectedCampaign.templateId ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{getTemplateById(selectedCampaign.templateId)?.name || 'Unknown Template'}</p>
                        <Badge variant="outline" className="bg-primary/10">Day 0</Badge>
                      </div>
                      <div className="text-sm bg-muted/30 p-3 rounded-md">
                        {getTemplateById(selectedCampaign.templateId)?.body || 'Template content not available'}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No initial message template selected.
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Follow-up Messages */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Follow-up Sequence</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddingFollowUp(true)}
                    disabled={selectedCampaign.status === 'completed'}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Follow-up
                  </Button>
                </div>
                
                {(!selectedCampaign.followUps || selectedCampaign.followUps.length === 0) ? (
                  <Card className="bg-muted/30">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-3">No follow-up messages configured yet.</p>
                      <p className="text-sm text-muted-foreground">
                        Add follow-up messages to automatically send to contacts based on conditions.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {selectedCampaign.followUps.map((followUp, index) => (
                      <Card key={followUp.id} className="relative">
                        {index > 0 && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <ArrowRight className="rotate-90 h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{getTemplateById(followUp.templateId)?.name || 'Unknown Template'}</p>
                              <Badge 
                                variant="outline" 
                                className={followUp.condition === 'no-response' 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-blue-100 text-blue-800"}
                              >
                                {followUp.condition === 'no-response' ? 'No Response Only' : 'All Contacts'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10">
                                Day {followUp.delayDays}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleRemoveFollowUp(followUp.id)}
                                disabled={selectedCampaign.status === 'completed'}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm bg-muted/30 p-3 rounded-md">
                            {getTemplateById(followUp.templateId)?.body || 'Template content not available'}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Sent {followUp.delayDays} days after the initial message
                            {followUp.condition === 'no-response' ? ', only if no response received' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Campaign Actions */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created: {format(new Date(selectedCampaign.createdAt), 'MMM d, yyyy')}
                      {selectedCampaign.status === 'active' && selectedCampaign.startedAt && (
                        <> • Started: {format(new Date(selectedCampaign.startedAt), 'MMM d, yyyy')}</>
                      )}
                      {selectedCampaign.status === 'completed' && selectedCampaign.completedAt && (
                        <> • Completed: {format(new Date(selectedCampaign.completedAt), 'MMM d, yyyy')}</>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedCampaign.status === 'draft' && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedCampaign.id, 'active')}
                      >
                        Activate Campaign
                      </Button>
                    )}
                    {selectedCampaign.status === 'active' && (
                      <Button 
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedCampaign.id, 'paused')}
                      >
                        Pause Campaign
                      </Button>
                    )}
                    {selectedCampaign.status === 'paused' && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedCampaign.id, 'active')}
                      >
                        Resume Campaign
                      </Button>
                    )}
                    {(selectedCampaign.status === 'active' || selectedCampaign.status === 'paused') && (
                      <Button 
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedCampaign.id, 'completed')}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Follow-up Dialog */}
      <Dialog open={addingFollowUp} onOpenChange={setAddingFollowUp}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Add Follow-up Message</DialogTitle>
            <DialogDescription>
              Configure an automated follow-up message for your campaign.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="followupTemplate">Message Template</Label>
              <Select
                value={newFollowUp.templateId || ''}
                onValueChange={(value) => setNewFollowUp({...newFollowUp, templateId: value})}
              >
                <SelectTrigger id="followupTemplate">
                  <SelectValue placeholder="Select a template for this follow-up" />
                </SelectTrigger>
                <SelectContent>
                  {templates.length === 0 ? (
                    <SelectItem value="no-templates" disabled>
                      No templates available. Create one first.
                    </SelectItem>
                  ) : (
                    templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the template to use for this follow-up message.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="followupDelay">Delay (Days)</Label>
              <Input
                id="followupDelay"
                type="number"
                min="1"
                max="30"
                value={newFollowUp.delayDays || 2}
                onChange={(e) => setNewFollowUp({...newFollowUp, delayDays: Number(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground">
                Number of days to wait after the initial message before sending this follow-up.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Send Condition</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-all",
                    newFollowUp.condition === 'all' 
                      ? "border-blue-500 bg-blue-50 text-blue-800" 
                      : "border-gray-200 hover:border-blue-200"
                  )}
                  onClick={() => setNewFollowUp({...newFollowUp, condition: 'all'})}
                >
                  <p className="font-medium text-sm">All Contacts</p>
                  <p className="text-xs mt-1 text-muted-foreground">Send to everyone in the campaign</p>
                </div>
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-all",
                    newFollowUp.condition === 'no-response' 
                      ? "border-red-500 bg-red-50 text-red-800" 
                      : "border-gray-200 hover:border-red-200"
                  )}
                  onClick={() => setNewFollowUp({...newFollowUp, condition: 'no-response'})}
                >
                  <p className="font-medium text-sm">No Response Only</p>
                  <p className="text-xs mt-1 text-muted-foreground">Only if no reply received</p>
                </div>
              </div>
            </div>
            
            {newFollowUp.templateId && (
              <div className="space-y-2 border-t pt-4">
                <Label>Preview</Label>
                <div className="p-3 border rounded-md bg-muted/30 text-sm">
                  {getTemplateById(newFollowUp.templateId)?.body || 'Template content not available'}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setAddingFollowUp(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFollowUp}>
              Add Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
