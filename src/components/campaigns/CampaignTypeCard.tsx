
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CampaignTypeInfo } from './types/campaignTypes';

interface CampaignTypeCardProps {
  typeInfo: CampaignTypeInfo;
  isSelected: boolean;
  onSelect: () => void;
}

const CampaignTypeCard: React.FC<CampaignTypeCardProps> = ({ 
  typeInfo, 
  isSelected, 
  onSelect 
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-primary hover:shadow-md",
        isSelected && "border-primary border-2 bg-primary/5"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className={cn("mb-2", typeInfo.color)}>
          {typeInfo.icon}
        </div>
        <CardTitle>{typeInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {typeInfo.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CampaignTypeCard;
