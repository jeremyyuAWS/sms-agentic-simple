
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart3,
  Calendar,
  Clock,
  Filter,
  ListFilter,
  MailCheck,
  MessageSquare,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Users,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Campaign, TimeWindow, CampaignGoalType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import ScheduleCampaign from '@/components/campaigns/ScheduleCampaign';
import CampaignJustification from '@/components/campaigns/CampaignJustification';
import NavigationButtons from '@/components/ui/navigation-buttons';

// Constants for goal types and their display properties
const goalTypeLabels: Record<CampaignGoalType, { label: string; color: string }> = {
  'lead-generation': { label: 'Lead Generation', color: 'bg-blue-100 text-blue-800' },
  'sales': { label: 'Sales', color: 'bg-green-100 text-green-800' },
  'event-promotion': { label: 'Event Promotion', color: 'bg-purple-100 text-purple-800' },
  'customer-feedback': { label: 'Customer Feedback', color: 'bg-amber-100 text-amber-800' },
  'event-follow-up': { label: 'Event Follow-up', color: 'bg-indigo-100 text-indigo-800' },
  'product-announcement': { label: 'Product Announcement', color: 'bg-pink-100 text-pink-800' },
  'survey': { label: 'Survey', color: 'bg-teal-100 text-teal-800' },
  'webinar-invitation': { label: 'Webinar Invitation', color: 'bg-orange-100 text-orange-800' },
  'newsletter': { label: 'Newsletter', color: 'bg-cyan-100 text-cyan-800' },
  'other': { label: 'Other', color: 'bg-gray-100 text-gray-800' },
};

const CampaignsEnhanced: React.FC = () => {
  const { campaigns, contacts, contactLists, templates, knowledgeBases, createCampaign, updateCampaignStatus, updateCampaignSchedule } = useApp();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [newCampaignOpen, setNewCampaignOpen] = useState<boolean>(false);
  const [showJustification, setShowJustification] = useState<boolean>(false);
  const [goalFilter, setGoalFilter] = useState<string>('all');
  
  // Filter and search campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    // Apply status filter
    if (filter !== 'all' && campaign.status !== filter) {
      return false;
    }
    
    // Apply goal filter
    if (goalFilter !== 'all' && campaign.goal?.type !== goalFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort campaigns by created date (newest first)
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleShowStats = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowJustification(true);
  };
  
  const handleCreateCampaign = (campaignData: any) => {
    try {
      const newCampaign = createCampaign(campaignData);
      toast({
        title: "Campaign Created",
        description: `Campaign "${campaignData.name}" has been created successfully.`
      });
      setNewCampaignOpen(false);
    } catch (error) {
      toast({
        title: "Error Creating Campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleStatusChange = (campaign: Campaign, newStatus: Campaign['status']) => {
    updateCampaignStatus(campaign.id, newStatus);
  };
  
  const handleScheduleUpdate = (scheduledStartDate: Date, timeZone?: string, sendingWindow?: TimeWindow) => {
    if (selectedCampaign) {
      updateCampaignSchedule(selectedCampaign.id, scheduledStartDate, timeZone, sendingWindow);
      setShowSchedule(false);
      
      toast({
        title: "Campaign Scheduled",
        description: `Campaign "${selectedCampaign.name}" has been scheduled to start on ${format(scheduledStartDate, 'PPP')}.`
      });
    }
  };
  
  // Count campaigns by status
  const campaignCounts = {
    all: campaigns.length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    active: campaigns.filter(c => c.status === 'active').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
  };
  
  // Get unique campaign goals
  const campaignGoals = Array.from(
    new Set(campaigns.filter(c => c.goal).map(c => c.goal?.type))
  ) as CampaignGoalType[];
  
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getGoalColor = (goalType?: CampaignGoalType) => {
    if (!goalType) return 'bg-gray-100 text-gray-800';
    return goalTypeLabels[goalType]?.color || 'bg-gray-100 text-gray-800';
  };
  
  const getGoalLabel = (goalType?: CampaignGoalType) => {
    if (!goalType) return 'No Goal';
    return goalTypeLabels[goalType]?.label || 'Unknown Goal';
  };
  
  const getCampaignProgress = (campaign: Campaign) => {
    if (!campaign.messagesSent || campaign.messagesSent === 0) return 0;
    return (campaign.messagesSent / campaign.contactCount) * 100;
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not scheduled';
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage multi-step outreach campaigns
          </p>
        </div>
        
        <Drawer open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
          <DrawerTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] max-w-6xl mx-auto">
            <DrawerHeader className="text-left">
              <DrawerTitle>Create New Campaign</DrawerTitle>
              <DrawerDescription>
                Set up your campaign details, contacts, and follow-up sequence
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2 max-h-[calc(90vh-150px)] overflow-y-auto">
              <CampaignCreator
                contacts={contacts}
                contactLists={contactLists}
                templates={templates}
                knowledgeBases={knowledgeBases}
                onCreateCampaign={handleCreateCampaign}
                onUpdateCampaign={() => {}}
                onCancel={() => setNewCampaignOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      <div className="space-y-5">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search campaigns..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status: {filter === 'all' ? 'All' : filter}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({campaignCounts.all})</SelectItem>
                    <SelectItem value="draft">Draft ({campaignCounts.draft})</SelectItem>
                    <SelectItem value="active">Active ({campaignCounts.active})</SelectItem>
                    <SelectItem value="paused">Paused ({campaignCounts.paused})</SelectItem>
                    <SelectItem value="completed">Completed ({campaignCounts.completed})</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={goalFilter} onValueChange={setGoalFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>Goal</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Goals</SelectItem>
                    {campaignGoals.map(goalType => (
                      <SelectItem key={goalType} value={goalType}>
                        {getGoalLabel(goalType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                  setGoalFilter('all');
                }}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Campaign List */}
        <div className="space-y-4">
          {sortedCampaigns.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filter !== 'all' || goalFilter !== 'all'
                  ? "Try adjusting your filters or search query" 
                  : "Create your first campaign to start reaching out to your contacts"}
              </p>
              {!(searchQuery || filter !== 'all' || goalFilter !== 'all') && (
                <Button onClick={() => setNewCampaignOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Campaign
                </Button>
              )}
            </Card>
          ) : (
            sortedCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b">
                    <Tabs defaultValue="overview" className="w-full">
                      <div className="px-6 pt-6 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            {campaign.goal && (
                              <Badge className={getGoalColor(campaign.goal.type)}>
                                {getGoalLabel(campaign.goal.type)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {campaign.description || "No description"}
                          </p>
                          {campaign.goal?.description && (
                            <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                              Goal: {campaign.goal.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          {campaign.status === 'draft' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(campaign, 'active')}
                            >
                              Activate
                            </Button>
                          )}
                          {campaign.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(campaign, 'paused')}
                            >
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(campaign, 'active')}
                            >
                              Resume
                            </Button>
                          )}
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">Campaign Actions</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="justify-start"
                                    onClick={() => {
                                      setSelectedCampaign(campaign);
                                      setShowSchedule(true);
                                    }}
                                  >
                                    <Calendar className="h-3.5 w-3.5 mr-2" />
                                    Schedule
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="justify-start"
                                    onClick={() => handleShowStats(campaign)}
                                  >
                                    <BarChart3 className="h-3.5 w-3.5 mr-2" />
                                    Analytics
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="justify-start"
                                    disabled={campaign.status === 'completed'}
                                    onClick={() => handleStatusChange(campaign, 'completed')}
                                  >
                                    <MailCheck className="h-3.5 w-3.5 mr-2" />
                                    Complete
                                  </Button>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                      
                      <TabsList className="px-6 pb-3 pt-0 justify-start border-b-0">
                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                        <TabsTrigger value="contacts" className="text-xs">Contacts</TabsTrigger>
                        <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                        <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="p-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 border-t">
                          <div className="p-4 border-r">
                            <p className="text-xs text-muted-foreground mb-1">Created</p>
                            <p className="text-sm font-medium">
                              {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="p-4 border-r">
                            <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                            <p className="text-sm font-medium">
                              {formatDate(campaign.scheduledStartDate)}
                            </p>
                          </div>
                          <div className="p-4 border-r">
                            <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <p className="text-sm font-medium">{campaign.contactCount}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                            <p className="text-sm font-medium">
                              {campaign.responseRate 
                                ? `${(campaign.responseRate * 100).toFixed(1)}%` 
                                : 'No data'}
                            </p>
                          </div>
                        </div>
                        
                        {(campaign.status === 'active' || campaign.status === 'paused') && (
                          <div className="px-4 pt-0 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Campaign Progress</p>
                              <p className="text-xs font-medium">
                                {campaign.messagesSent || 0}/{campaign.contactCount} contacts
                              </p>
                            </div>
                            <Progress value={getCampaignProgress(campaign)} className="h-2" />
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="contacts" className="p-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium">{campaign.contactCount} contacts in campaign</p>
                          <Button variant="outline" size="sm" className="h-8">
                            <ListFilter className="h-3.5 w-3.5 mr-1.5" />
                            View Segments
                          </Button>
                        </div>
                        
                        <div className="bg-muted/30 rounded-md p-3 text-center text-muted-foreground">
                          <p className="text-sm">Contact details available in full campaign view</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="messages" className="p-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium">Initial message + {campaign.followUps?.length || 0} follow-ups</p>
                          <div className="text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 inline mr-1" />
                            {campaign.sendingWindow ? (
                              <span>
                                {campaign.sendingWindow.startTime} - {campaign.sendingWindow.endTime}
                              </span>
                            ) : (
                              <span>No sending window set</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-md p-3 text-center text-muted-foreground">
                          <p className="text-sm">Message sequence details available in full campaign view</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="goals" className="p-4 border-t">
                        {campaign.goal ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  {getGoalLabel(campaign.goal.type)}
                                </h4>
                                {campaign.goal.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{campaign.goal.description}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="ml-auto">
                                {campaign.goal.targetMetrics?.completionDays || 14} days
                              </Badge>
                            </div>
                            
                            {campaign.goal.targetMetrics && (
                              <div className="space-y-3 pt-1">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <p className="text-xs text-muted-foreground">Target Response Rate</p>
                                    <div className="flex items-center gap-1">
                                      <p className="text-xs font-medium">
                                        {campaign.responseRate ? (campaign.responseRate * 100).toFixed(1) : 0}% /
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Target: {(campaign.goal.targetMetrics.responseRate || 0) * 100}%
                                      </p>
                                    </div>
                                  </div>
                                  <Progress 
                                    value={campaign.responseRate ? (campaign.responseRate / (campaign.goal.targetMetrics.responseRate || 0.2)) * 100 : 0} 
                                    className="h-2" 
                                  />
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <p className="text-xs text-muted-foreground">Target Conversion Rate</p>
                                    <div className="flex items-center gap-1">
                                      <p className="text-xs font-medium">
                                        {campaign.performance?.conversionCount 
                                          ? ((campaign.performance.conversionCount / campaign.contactCount) * 100).toFixed(1) 
                                          : 0}% /
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Target: {(campaign.goal.targetMetrics.conversionRate || 0) * 100}%
                                      </p>
                                    </div>
                                  </div>
                                  <Progress 
                                    value={campaign.performance?.conversionCount 
                                      ? ((campaign.performance.conversionCount / campaign.contactCount) / (campaign.goal.targetMetrics.conversionRate || 0.1)) * 100 
                                      : 0} 
                                    className="h-2" 
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-muted/30 rounded-md p-3 text-center text-muted-foreground">
                            <p className="text-sm">No goals defined for this campaign</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {selectedCampaign && (
        <Drawer open={showSchedule} onOpenChange={setShowSchedule}>
          <DrawerContent className="max-w-xl mx-auto">
            <DrawerHeader>
              <DrawerTitle>Schedule Campaign: {selectedCampaign.name}</DrawerTitle>
              <DrawerDescription>
                Set when your campaign should start and define sending windows
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <ScheduleCampaign 
                campaign={selectedCampaign}
                onScheduleUpdate={handleScheduleUpdate}
                onClose={() => setShowSchedule(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
      
      {selectedCampaign && (
        <CampaignJustification 
          campaignId={selectedCampaign.id}
          isOpen={showJustification}
          onClose={() => {
            setShowJustification(false);
            setSelectedCampaign(null);
          }}
        />
      )}
      
      {/* Navigation Buttons */}
      <NavigationButtons currentPage="campaigns" />
    </div>
  );
};

export default CampaignsEnhanced;
