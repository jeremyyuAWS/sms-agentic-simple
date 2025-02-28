
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InfoIcon } from 'lucide-react';

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
          required
          aria-required="true"
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
      
      {/* Best Practices */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mt-6">
        <h3 className="text-lg font-medium mb-2 text-blue-700 flex items-center">
          <InfoIcon className="h-5 w-5 mr-2" />
          Campaign Best Practices
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5 text-sm text-blue-700 list-disc">
          <li>Keep messages concise: SMS messages should be brief and to the point</li>
          <li>Include a clear call-to-action in each message</li>
          <li>Personalize messages with recipient's name when possible</li>
          <li>Always identify yourself or your company in the first message</li>
          <li>Send during business hours to maximize response rates</li>
          <li>Follow up strategically - the sequence is pre-configured for optimal engagement</li>
        </ul>
      </div>
    </div>
  );
};

export default CampaignDetailsTab;
