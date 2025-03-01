
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CampaignDetailsTabProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  knowledgeBaseId?: string;
  knowledgeBases?: any[];
  onKnowledgeBaseSelect?: (value: string) => void;
}

const CampaignDetailsTab: React.FC<CampaignDetailsTabProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium">Campaign Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Enter campaign name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter campaign description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[120px] w-full"
        />
      </div>
    </div>
  );
};

export default CampaignDetailsTab;
