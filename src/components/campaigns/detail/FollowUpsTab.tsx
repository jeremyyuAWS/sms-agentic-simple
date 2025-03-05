
import React from 'react';
import { Campaign } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FollowUpsTabProps {
  campaign: Campaign;
}

export const FollowUpsTab: React.FC<FollowUpsTabProps> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Follow-up Messages</CardTitle>
        <CardDescription>
          {campaign.followUps && campaign.followUps.length > 0 
            ? `${campaign.followUps.length} follow-ups configured` 
            : 'No follow-ups configured'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {campaign.followUps && campaign.followUps.length > 0 ? (
          <div className="space-y-4">
            {campaign.followUps.map((followUp, index) => (
              <div key={followUp.id} className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Follow-up {index + 1}</div>
                  <Badge variant="outline">
                    {followUp.delayDays} days after
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-sm text-muted-foreground">
                  {followUp.condition === 'no-response' 
                    ? 'Sent only if no response received' 
                    : 'Sent to all contacts'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No follow-up messages configured for this campaign.</p>
        )}
      </CardContent>
    </Card>
  );
};
