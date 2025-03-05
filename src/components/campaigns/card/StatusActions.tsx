
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StopCircle, Edit, Eye } from 'lucide-react';
import { Campaign } from '@/lib/types';

interface StatusActionsProps {
  campaign: Campaign;
  onStatusChange: (e: React.MouseEvent, status: Campaign['status']) => void;
  onEdit: (e: React.MouseEvent) => void;
  onView: (e: React.MouseEvent) => void;
}

const StatusActions: React.FC<StatusActionsProps> = ({
  campaign,
  onStatusChange,
  onEdit,
  onView
}) => {
  switch (campaign.status) {
    case 'active':
      return (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(e) => onStatusChange(e, 'paused')}
          >
            <Pause className="h-3.5 w-3.5 mr-1" /> Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(e) => onStatusChange(e, 'completed')}
          >
            <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
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
            onClick={(e) => onStatusChange(e, 'active')}
          >
            <Play className="h-3.5 w-3.5 mr-1" /> Resume
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(e) => onStatusChange(e, 'completed')}
          >
            <StopCircle className="h-3.5 w-3.5 mr-1" /> Stop
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
        </>
      );
    case 'draft':
      return (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(e) => onStatusChange(e, 'active')}
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
            onClick={onView}
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View Results
          </Button>
        </>
      );
    default:
      return campaign.status !== 'completed' ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={onEdit}
        >
          <Edit className="h-3.5 w-3.5 mr-1" /> View
        </Button>
      ) : null;
  }
};

export default StatusActions;
