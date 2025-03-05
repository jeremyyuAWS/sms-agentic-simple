
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CampaignType } from './CampaignTypeSelector';
import { campaignTypes } from './types/campaignTypes';

interface SimplifiedCampaignTypeGridProps {
  onSelect: (type: CampaignType) => void;
}

const SimplifiedCampaignTypeGrid: React.FC<SimplifiedCampaignTypeGridProps> = ({ 
  onSelect 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Campaign Type</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Select the type of campaign that best fits your outreach goals
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {campaignTypes.map((type) => (
          <Card 
            key={type.id}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-md overflow-hidden group h-full"
            onClick={() => onSelect(type.id as CampaignType)}
          >
            <div className={`h-2 w-full ${type.color.replace('text-', 'bg-')} border-b ${type.color.replace('text-', 'border-')}`}></div>
            <CardHeader className="pb-2 space-y-3">
              <div className={`p-3 rounded-full ${type.color.replace('text-', 'bg-')}/10 ${type.color} w-fit mb-0 transition-transform group-hover:scale-110`}>
                {type.icon}
              </div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-sm ${type.color} hover:${type.color.replace('text-', 'bg-')}/10`}
              >
                Select This Campaign Type
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimplifiedCampaignTypeGrid;
