
import React from 'react';
import { 
  Info, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
    { id: 'details', label: 'Details', icon: Info },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'template', label: 'Template', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'followups', label: 'Follow-ups', icon: MessageSquare },
  ];

  // Find the index of the current active tab
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Determine the previous and next tabs
  const prevTab = activeTabIndex > 0 ? tabs[activeTabIndex - 1] : null;
  const nextTab = activeTabIndex < tabs.length - 1 ? tabs[activeTabIndex + 1] : null;
  
  // Function to navigate to the previous or next tab
  const navigateToPrevTab = () => {
    if (prevTab) {
      onTabChange(prevTab.id);
    }
  };
  
  const navigateToNextTab = () => {
    if (nextTab) {
      onTabChange(nextTab.id);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="border-b mb-4 w-full">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCompleted = index < activeTabIndex;
            
            return (
              <button
                key={tab.id}
                className={cn(
                  "flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : isCompleted
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full mr-1.5 sm:mr-2 text-xs">
                  {isCompleted ? (
                    <span className="text-primary">✓</span>
                  ) : (
                    <Icon className={cn("h-4 w-4")} />
                  )}
                </span>
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.id === 'followups' ? 'Follow' : tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-4">
        <div className="text-sm text-muted-foreground">
          Step {activeTabIndex + 1} of {tabs.length}: <span className="font-medium text-foreground">{tabs[activeTabIndex].label}</span>
        </div>
      </div>
      
      {/* Navigation buttons - shown at the bottom through TabNavButtons component */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={navigateToPrevTab}
          disabled={!prevTab}
          className={cn(!prevTab && "invisible")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {prevTab ? `Back to ${prevTab.label}` : "Back"}
        </Button>
        
        <Button
          onClick={navigateToNextTab}
          disabled={!nextTab}
          className={cn(!nextTab && "invisible")}
        >
          {nextTab ? `Continue to ${nextTab.label}` : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CampaignCreatorTabs;
