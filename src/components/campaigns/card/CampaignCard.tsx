import React, { useCallback, memo } from 'react';
import { Campaign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import StatusBadge from '../StatusBadge';
import CampaignCardMetrics from './CampaignCardMetrics';
import StatusActions from './StatusActions';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
  onSelect: (campaignId: string, defaultTab?: string) => void;
  onUpdateStatus: (campaignId: string, status: Campaign['status']) => void;
  onEdit?: (campaignId: string) => void;
  onDelete?: (campaignId: string) => void;
}

const CampaignCard = memo(({
  campaign,
  index,
  onSelect,
  onUpdateStatus,
  onEdit,
  onDelete
}: CampaignCardProps) => {
  const handleStatusChange = useCallback((e: React.MouseEvent, status: Campaign['status']) => {
    e.stopPropagation();
    onUpdateStatus(campaign.id, status);
  }, [campaign.id, onUpdateStatus]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && campaign.status !== 'completed') {
      onEdit(campaign.id);
    } else {
      onSelect(campaign.id, 'overview');
    }
  }, [campaign.id, campaign.status, onEdit, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(campaign.id);
    }
  }, [campaign.id, onDelete]);
  
  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(campaign.id, 'analytics');
  }, [campaign.id, onSelect]);

  return (
    <AnimatedCard
      className="cursor-pointer hover:shadow-md transition-shadow"
      animationDelay={index * 100}
      onClick={() => campaign.status === 'completed' 
        ? onSelect(campaign.id, 'analytics') 
        : onSelect(campaign.id, 'overview')}
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

      <CampaignCardMetrics campaign={campaign} />

      <div className="flex justify-end space-x-2 mt-4">
        <StatusActions
          campaign={campaign}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>
    </AnimatedCard>
  );
});

CampaignCard.displayName = 'CampaignCard';

export default CampaignCard;
