
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { useToast } from '@/hooks/use-toast';
import CampaignWizard from './CampaignWizard';
import { Campaign } from '@/lib/types';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimplifiedCampaignCreatorProps {
  onCancel: () => void;
  onComplete: () => void;
}

const SimplifiedCampaignCreator: React.FC<SimplifiedCampaignCreatorProps> = ({
  onCancel,
  onComplete
}) => {
  const { createCampaign } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      setIsSubmitting(true);
      
      // Create the campaign
      createCampaign({
        ...campaignData,
        status: 'draft',
        updatedAt: new Date(),
      } as any);
      
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been created successfully.",
      });
      
      // Notify parent component
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground mt-1">
            Follow the steps to set up your campaign
          </p>
        </div>
        
        <Button variant="outline" onClick={onCancel}>
          <Undo2 className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>
      
      <CampaignWizard
        onComplete={handleCreateCampaign}
        onCancel={onCancel}
      />
    </div>
  );
};

export default SimplifiedCampaignCreator;
