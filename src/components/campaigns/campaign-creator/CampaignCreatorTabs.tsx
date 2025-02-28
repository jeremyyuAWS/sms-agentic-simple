
import React from 'react';
import { Button } from '@/components/ui/button';

interface CampaignCreatorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CampaignCreatorTabs: React.FC<CampaignCreatorTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'template', label: 'Template' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'followups', label: 'Follow-ups' },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-0.5 flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map(tab => (
          <Button 
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default CampaignCreatorTabs;
