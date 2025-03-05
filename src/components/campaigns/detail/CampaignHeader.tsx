
import React from 'react';
import { Campaign } from '@/lib/types';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MoreVertical, PauseCircle, PlayCircle, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CampaignHeaderProps {
  campaign: Campaign;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
  onEdit: (campaignId: string) => void;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaign,
  onStatusChange,
  onEdit
}) => {
  const handleStatusChange = (status: Campaign['status']) => {
    onStatusChange(campaign.id, status);
  };
  
  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500">Draft</Badge>;
      case 'paused':
        return <Badge className="bg-gray-500">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">{campaign.name}</CardTitle>
          {getStatusBadge(campaign.status)}
        </div>
        <CardDescription className="mt-2">
          {campaign.description || 'No description provided'}
        </CardDescription>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Only show Edit button if campaign is not completed */}
        {campaign.status !== 'completed' && (
          <Button variant="outline" size="sm" onClick={() => onEdit(campaign.id)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {campaign.status === 'active' && (
              <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause Campaign
              </DropdownMenuItem>
            )}
            
            {campaign.status === 'paused' && (
              <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Resume Campaign
              </DropdownMenuItem>
            )}
            
            {campaign.status === 'draft' && (
              <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Campaign
              </DropdownMenuItem>
            )}
            
            {(campaign.status === 'active' || campaign.status === 'paused') && (
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Campaign
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
