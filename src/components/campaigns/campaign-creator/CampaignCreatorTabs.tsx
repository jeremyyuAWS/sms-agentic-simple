
import React from 'react';
import { 
  Info, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignCreatorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CampaignCreatorTabs: React.FC<CampaignCreatorTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'details', label: 'Details', icon: Info },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'template', label: 'Template', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'followups', label: 'Follow-ups', icon: MessageSquare },
  ];

  return (
    <div className="border-b mb-4 w-full">
      <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={cn(
                "flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4 mr-1.5 sm:mr-2")} />
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.id === 'followups' ? 'Follow' : tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CampaignCreatorTabs;
