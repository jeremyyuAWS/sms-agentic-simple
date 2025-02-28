
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign, TimeWindow } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  ArrowUpDown, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Filter, 
  ListFilter, 
  MoreHorizontal, 
  PauseCircle, 
  Plus, 
  RefreshCw, 
  Search, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import CampaignCreator from '@/components/campaigns/CampaignCreator';
import CampaignDetailView from '@/components/campaigns/CampaignDetailView';
import CampaignAnalytics from '@/components/campaigns/CampaignAnalytics';
import NavigationButtons from '@/components/ui/navigation-buttons';
import ScheduleCampaignWrapper from '@/components/campaigns/ScheduleCampaignWrapper';

type ActiveView = 'list' | 'detail' | 'create' | 'analytics' | 'schedule';
type FilterStatus = 'all' | 'draft' | 'active' | 'paused' | 'completed';
type SortField = 'name' | 'status' | 'contacts' | 'date' | 'responses';
type SortOrder = 'asc' | 'desc';

const CampaignsEnhanced: React.FC = () => {
  const { campaigns, updateCampaignStatus, updateCampaignSchedule } = useApp();
  const { toast } = useToast();
  
  // UI state
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => {
      // Filter by status
      if (statusFilter !== 'all' && campaign.status !== statusFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          campaign.name.toLowerCase().includes(query) ||
          (campaign.description && campaign.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'name':
          return multiplier * a.name.localeCompare(b.name);
        case 'status':
          return multiplier * a.status.localeCompare(b.status);
        case 'contacts':
          return multiplier * (a.contactCount - b.contactCount);
        case 'responses':
          const aRate = a.responseRate || 0;
          const bRate = b.responseRate || 0;
          return multiplier * (aRate - bRate);
        case 'date':
        default:
          const aDate = a.updatedAt || a.createdAt;
          const bDate = b.updatedAt || b.createdAt;
          return multiplier * (new Date(aDate).getTime() - new Date(bDate).getTime());
      }
    });
  
  // Handle view campaign details
  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveView('detail');
  };
  
  // Handle campaign status change
  const handleStatusChange = (campaignId: string, status: Campaign['status']) => {
    updateCampaignStatus(campaignId, status);
    
    toast({
      title: "Campaign Updated",
      description: `Campaign status has been changed to ${status}.`
    });
  };
  
  // Handle schedule update
  const handleScheduleUpdate = (campaignId: string, scheduledStartDate: Date, timeZone?: string, sendingWindow?: TimeWindow) => {
    updateCampaignSchedule(campaignId, scheduledStartDate, timeZone, sendingWindow);
    
    toast({
      title: "Schedule Updated",
      description: "Campaign schedule has been updated successfully."
    });
    
    // Go back to detail view
    setActiveView('detail');
  };
  
  // Get count of campaigns by status
  const getCampaignCountByStatus = (status: Campaign['status']) => {
    return campaigns.filter(c => c.status === status).length;
  };
  
  // Reset to list view
  const handleBackToList = () => {
    setSelectedCampaign(null);
    setActiveView('list');
  };
  
  // Render status badge
  const renderStatusBadge = (status: Campaign['status']) => {
    let color: string;
    let icon: React.ReactNode;
    
    switch (status) {
      case 'active':
        color = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case 'paused':
        color = 'bg-yellow-100 text-yellow-800';
        icon = <PauseCircle className="h-3 w-3 mr-1" />;
        break;
      case 'completed':
        color = 'bg-blue-100 text-blue-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case 'draft':
      default:
        color = 'bg-gray-100 text-gray-800';
        icon = <Clock className="h-3 w-3 mr-1" />;
    }
    
    return (
      <Badge variant="outline" className={`flex items-center ${color}`}>
        {icon}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </Badge>
    );
  };
  
  const handleCreateCampaign = (campaignData: any) => {
    toast({
      title: "Campaign Created",
      description: `Campaign "${campaignData.name}" has been created successfully.`
    });
    setActiveView('list');
  };
  
  const handleUpdateCampaign = () => {
    toast({
      title: "Campaign Updated",
      description: "Campaign has been updated successfully."
    });
    setActiveView('list');
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your outreach campaigns
          </p>
        </div>
        
        {activeView === 'list' && (
          <Button onClick={() => setActiveView('create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        )}
        
        {activeView !== 'list' && (
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        )}
      </div>
      
      {activeView === 'list' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>
                View and manage all your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all" className="text-xs">
                      All ({campaigns.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="text-xs">
                      Active ({getCampaignCountByStatus('active')})
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="text-xs">
                      Draft ({getCampaignCountByStatus('draft')})
                    </TabsTrigger>
                    <TabsTrigger value="paused" className="text-xs">
                      Paused ({getCampaignCountByStatus('paused')})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">
                      Completed ({getCampaignCountByStatus('completed')})
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search campaigns..."
                        className="pl-8 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Date Range</DropdownMenuItem>
                        <DropdownMenuItem>Response Rate</DropdownMenuItem>
                        <DropdownMenuItem>Contact Count</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center gap-1">
                              Campaign Name
                              {sortField === 'name' && (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center gap-1">
                              Status
                              {sortField === 'status' && (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('contacts')}
                          >
                            <div className="flex items-center gap-1">
                              Contacts
                              {sortField === 'contacts' && (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('responses')}
                          >
                            <div className="flex items-center gap-1">
                              Responses
                              {sortField === 'responses' && (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('date')}
                          >
                            <div className="flex items-center gap-1">
                              Last Updated
                              {sortField === 'date' && (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCampaigns.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No campaigns found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCampaigns.map((campaign) => (
                            <TableRow 
                              key={campaign.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewCampaign(campaign)}
                            >
                              <TableCell className="font-medium">
                                {campaign.name}
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(campaign.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{campaign.contactCount}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {campaign.responseRate ? (
                                  <Badge variant="outline" className="bg-blue-50">
                                    {campaign.responseRate}%
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {format(new Date(campaign.updatedAt || campaign.createdAt), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCampaign(campaign);
                                        setActiveView('analytics');
                                      }}
                                    >
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      View Analytics
                                    </DropdownMenuItem>
                                    
                                    {campaign.status === 'draft' && (
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(campaign.id, 'active');
                                        }}
                                      >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Activate
                                      </DropdownMenuItem>
                                    )}
                                    
                                    {campaign.status === 'active' && (
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(campaign.id, 'paused');
                                        }}
                                      >
                                        <PauseCircle className="h-4 w-4 mr-2" />
                                        Pause
                                      </DropdownMenuItem>
                                    )}
                                    
                                    {campaign.status === 'paused' && (
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(campaign.id, 'active');
                                        }}
                                      >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Resume
                                      </DropdownMenuItem>
                                    )}
                                    
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCampaign(campaign);
                                        setActiveView('schedule');
                                      }}
                                    >
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Schedule
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="active">
                  {/* Filter to active campaigns */}
                </TabsContent>
                
                <TabsContent value="draft">
                  {/* Filter to draft campaigns */}
                </TabsContent>
                
                <TabsContent value="paused">
                  {/* Filter to paused campaigns */}
                </TabsContent>
                
                <TabsContent value="completed">
                  {/* Filter to completed campaigns */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeView === 'detail' && selectedCampaign && (
        <CampaignDetailView
          campaign={selectedCampaign}
          onClose={handleBackToList}
          onStatusChange={handleStatusChange}
          onEdit={() => {
            /* Implement edit functionality */
          }}
        />
      )}
      
      {activeView === 'analytics' && selectedCampaign && (
        <CampaignAnalytics
          campaign={selectedCampaign}
          onBack={() => setActiveView('detail')}
        />
      )}
      
      {activeView === 'schedule' && selectedCampaign && (
        <ScheduleCampaignWrapper
          campaign={selectedCampaign}
          onScheduleUpdate={(date, timeZone, window) => {
            handleScheduleUpdate(selectedCampaign.id, date, timeZone, window);
          }}
          onClose={() => setActiveView('detail')}
        />
      )}
      
      {activeView === 'create' && (
        <CampaignCreator
          onCreateCampaign={handleCreateCampaign}
          onUpdateCampaign={handleUpdateCampaign}
          onCancel={handleBackToList}
        />
      )}
      
      {/* Navigation Buttons */}
      <NavigationButtons currentPage="campaigns" />
    </div>
  );
};

export default CampaignsEnhanced;
