
import React, { useCallback, memo } from 'react';
import { Campaign } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  StopCircle,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import StatusBadge from './StatusBadge';

interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (campaignId: string, defaultTab?: string) => void;
  onUpdateStatus: (campaignId: string, status: Campaign['status']) => void;
  onEdit?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
}

// Memoized campaign card component to improve performance for large lists
const CampaignCard = memo(({ 
  campaign, 
  index,
  onSelect,
  onUpdateStatus,
  onEdit,
  onDelete
}: { 
  campaign: Campaign; 
  index: number;
  onSelect: (campaignId: string, defaultTab?: string) => void;
  onUpdateStatus: (campaignId: string, status: Campaign['status']) => void;
  onEdit?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
}) => {
  // Use callbacks to prevent recreation of these functions on every render
  const handleStatusChange = useCallback((e: React.MouseEvent, status: Campaign['status']) => {
    e.stopPropagation();
    onUpdateStatus(campaign.id, status);
  }, [campaign.id, onUpdateStatus]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(campaign.id);
    } else {
      onSelect(campaign.id);
    }
  }, [campaign.id, onEdit, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(campaign.id);
    }
  }, [campaign.id, onDelete]);
  
  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // For completed campaigns, navigate directly to analytics tab
    onSelect(campaign.id, 'analytics');
  }, [campaign.id, onSelect]);

  const getStatusActions = () => {
    switch (campaign.status) {
      case 'active':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, 'paused')}
            >
              <Pause className="h-3.5 w-3.5 mr-1" /> Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, 'completed')}
            >
              <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
            )}
          </>
        );
      case 'paused':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, 'active')}
            >
              <Play className="h-3.5 w-3.5 mr-1" /> Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, 'completed')}
            >
              <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
            )}
          </>
        );
      case 'draft':
        return (
          <>
            {onEdit ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(campaign.id);
                }}
              >
                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => handleStatusChange(e, 'active')}
            >
              <Play className="h-3.5 w-3.5 mr-1" /> Start
            </Button>
          </>
        );
      case 'completed':
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleView}
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> View Results
            </Button>
          </>
        );
      default:
        return (
          <>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 mr-1" /> View
              </Button>
            )}
          </>
        );
    }
  };

  return (
    <AnimatedCard
      className="cursor-pointer hover:shadow-md transition-shadow"
      animationDelay={index * 100}
      onClick={() => campaign.status === 'completed' ? onSelect(campaign.id, 'analytics') : onSelect(campaign.id)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">{campaign.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={campaign.status} />
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Created {formatDistance(new Date(campaign.createdAt), new Date(), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{campaign.contactCount || 0} contacts</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {campaign.sendingWindow?.startTime || "N/A"} - {campaign.sendingWindow?.endTime || "N/A"}
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
        {getStatusActions()}
      </div>
    </AnimatedCard>
  );
});

CampaignCard.displayName = 'CampaignCard';

const CampaignList: React.FC<CampaignListProps> = ({ 
  campaigns, 
  onSelect, 
  onUpdateStatus,
  onEdit,
  onDelete
}) => {
  // If no campaigns, show a message
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No campaigns yet. Click "New Campaign" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign, index) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          index={index}
          onSelect={onSelect}
          onUpdateStatus={onUpdateStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CampaignList;
