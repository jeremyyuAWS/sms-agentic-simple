
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Mail, 
  Calendar, 
  MessageSquareMore, 
  Check, 
  AlertCircle
} from 'lucide-react';

export type CampaignCreatorTabType = 'details' | 'contacts' | 'template' | 'schedule' | 'followups';

interface CampaignCreatorTabsProps {
  activeTab: CampaignCreatorTabType;
  onTabChange: (tab: CampaignCreatorTabType) => void;
  completedTabs?: CampaignCreatorTabType[];
}

const CampaignCreatorTabs: React.FC<CampaignCreatorTabsProps> = ({ 
  activeTab, 
  onTabChange,
  completedTabs = []
}) => {
  const isTabComplete = (tab: CampaignCreatorTabType) => {
    return completedTabs.includes(tab);
  };

  const renderBadge = (tab: CampaignCreatorTabType) => {
    if (isTabComplete(tab)) {
      return (
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
          <Check className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    }
    
    if (tab === activeTab) {
      return (
        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
          Current
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as CampaignCreatorTabType)} className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="details" className="flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Details</span>
          <span className="inline md:hidden">Info</span>
          {renderBadge('details')}
        </TabsTrigger>
        <TabsTrigger value="contacts" className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Contacts</span>
          <span className="inline md:hidden">To</span>
          {renderBadge('contacts')}
        </TabsTrigger>
        <TabsTrigger value="template" className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Template</span>
          <span className="inline md:hidden">Msg</span>
          {renderBadge('template')}
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Schedule</span>
          <span className="inline md:hidden">When</span>
          {renderBadge('schedule')}
        </TabsTrigger>
        <TabsTrigger value="followups" className="flex items-center">
          <MessageSquareMore className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Follow-ups</span>
          <span className="inline md:hidden">Next</span>
          {renderBadge('followups')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CampaignCreatorTabs;
