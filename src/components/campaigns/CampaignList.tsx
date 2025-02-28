
import React from 'react';
import { Campaign } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts';
import {
  Play,
  Pause,
  StopCircle,
  Calendar,
  Users,
  BarChart3,
  Clock,
} from 'lucide-react';
import { formatDistance } from 'date-fns';

interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (campaign: Campaign) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onSelect }) => {
  const { updateCampaignStatus } = useApp();

  const handleStatusChange = (e: React.MouseEvent, campaign: Campaign, status: Campaign['status']) => {
    e.stopPropagation();
    updateCampaignStatus(campaign.id, status);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Active</div>;
      case 'paused':
        return <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Paused</div>;
      case 'completed':
        return <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Completed</div>;
      default:
        return <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Draft</div>;
    }
  };

  const getStatusActions = (campaign: Campaign) => {
    switch (campaign.status) {
      case 'active':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, campaign, 'paused')}
            >
              <Pause className="h-3.5 w-3.5 mr-1" /> Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, campaign, 'completed')}
            >
              <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
            </Button>
          </>
        );
      case 'paused':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, campaign, 'active')}
            >
              <Play className="h-3.5 w-3.5 mr-1" /> Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, campaign, 'completed')}
            >
              <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
            </Button>
          </>
        );
      case 'draft':
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(e) => handleStatusChange(e, campaign, 'active')}
          >
            <Play className="h-3.5 w-3.5 mr-1" /> Start
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign, index) => (
        <AnimatedCard
          key={campaign.id}
          className="cursor-pointer"
          animationDelay={index * 100}
          onClick={() => onSelect(campaign)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
            </div>
            <div>{getStatusBadge(campaign.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created {formatDistance(campaign.createdAt, new Date(), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{campaign.contactCount} contacts</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {campaign.sendingWindow.startTime} - {campaign.sendingWindow.endTime}
              </span>
            </div>
          </div>

          {campaign.responseRate && (
            <div className="mt-4 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {(campaign.responseRate * 100).toFixed(1)}% response rate
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            {getStatusActions(campaign)}
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default CampaignList;
