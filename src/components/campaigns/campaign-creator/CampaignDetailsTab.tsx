
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KnowledgeBase } from '@/lib/types';

interface CampaignDetailsTabProps {
  knowledgeBaseId: string;
  knowledgeBases: KnowledgeBase[];
  onKnowledgeBaseSelect: (value: string) => void;
}

const CampaignDetailsTab: React.FC<CampaignDetailsTabProps> = ({
  knowledgeBaseId,
  knowledgeBases,
  onKnowledgeBaseSelect
}) => {
  const knowledgeBaseOptions = knowledgeBases.map(kb => ({
    value: kb.id,
    label: kb.title
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="knowledgeBase">Knowledge Base (Optional)</Label>
        <Select 
          value={knowledgeBaseId} 
          onValueChange={onKnowledgeBaseSelect}
        >
          <SelectTrigger id="knowledgeBase">
            <SelectValue placeholder="Select a knowledge base" />
          </SelectTrigger>
          <SelectContent>
            {knowledgeBaseOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CampaignDetailsTab;
