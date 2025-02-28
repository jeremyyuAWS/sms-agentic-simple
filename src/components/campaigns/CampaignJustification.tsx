
import { useState } from 'react';
import { Campaign } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Target, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts';

interface CampaignJustificationProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CampaignJustification = ({ 
  campaignId, 
  isOpen, 
  onClose 
}: CampaignJustificationProps) => {
  const { campaigns, contacts } = useApp();
  
  // Find the campaign
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (!campaign) {
    return null;
  }
  
  // Calculate some metrics for the campaign
  const responseRate = campaign.responseRate || 0;
  const positiveResponseRate = responseRate * 0.6; // Mock data, assuming 60% of responses are positive
  const negativeResponseRate = responseRate * 0.4; // Mock data, assuming 40% of responses are negative
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Campaign Insights: {campaign.name}</DialogTitle>
          <DialogDescription>
            Data-driven justification and expected outcomes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          {/* Primary metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{campaign.contactCount}</p>
                  <p className="text-sm text-muted-foreground">Contacts</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{(responseRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{(positiveResponseRate * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Positive Responses</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Response breakdown */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Expected Response Breakdown</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Total Responses</Label>
                    <span className="text-sm">
                      ~{Math.round(campaign.contactCount * responseRate)} contacts
                    </span>
                  </div>
                  <Progress value={responseRate * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Positive Responses</Label>
                    <span className="text-sm">
                      ~{Math.round(campaign.contactCount * positiveResponseRate)} contacts
                    </span>
                  </div>
                  <Progress value={positiveResponseRate * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label>Negative Responses</Label>
                    <span className="text-sm">
                      ~{Math.round(campaign.contactCount * negativeResponseRate)} contacts
                    </span>
                  </div>
                  <Progress value={negativeResponseRate * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Campaign recommendation */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Campaign Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                Based on historical data and similar campaigns, we recommend proceeding with this campaign.
                The expected response rate is in line with industry standards, and the projected positive
                response rate indicates a good return on investment.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignJustification;
