
import React from 'react';
import { Campaign } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, PauseCircle, PlayCircle } from 'lucide-react';

interface StatusCardProps {
  campaign: Campaign;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({ campaign, onStatusChange }) => {
  const handleStatusChange = (status: Campaign['status']) => {
    onStatusChange(campaign.id, status);
  };

  if (campaign.status === 'active') {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Campaign Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Campaign is running</span>
            </div>
            <Button size="sm" variant="outline" 
                    className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => handleStatusChange('paused')}>
              Pause Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (campaign.status === 'draft') {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">Campaign Draft</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Campaign is in draft mode</span>
            </div>
            <Button size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => handleStatusChange('active')}>
              Start Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (campaign.status === 'paused') {
    return (
      <Card className="bg-gray-100 border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-800">Campaign Paused</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PauseCircle className="h-4 w-4 mr-2" />
              <span>Campaign is currently paused</span>
            </div>
            <Button size="sm" 
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={() => handleStatusChange('active')}>
              Resume Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (campaign.status === 'completed') {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Campaign Completed</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-700">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Campaign has been completed</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
