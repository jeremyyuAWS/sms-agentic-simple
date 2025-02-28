
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Users, Bell, Calendar, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CampaignType = 'event-invitation' | 'sales-outreach' | 'follow-up-reminder' | 'meeting-scheduling' | 'announcement';

interface CampaignTypeInfo {
  id: CampaignType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CampaignTypeSelectorProps {
  selectedType: CampaignType | null;
  onSelect: (type: CampaignType) => void;
}

const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  const campaignTypes: CampaignTypeInfo[] = [
    {
      id: 'event-invitation',
      title: 'Event Invitation',
      description: 'Invite contacts to an upcoming event, webinar, or conference',
      icon: <Calendar className="h-8 w-8" />,
      color: 'text-blue-500'
    },
    {
      id: 'sales-outreach',
      title: 'Sales Outreach',
      description: 'Connect with potential customers to promote your products or services',
      icon: <Users className="h-8 w-8" />,
      color: 'text-green-500'
    },
    {
      id: 'follow-up-reminder',
      title: 'Follow-Up Reminder',
      description: 'Send reminders to contacts who have not responded to previous messages',
      icon: <Bell className="h-8 w-8" />,
      color: 'text-purple-500'
    },
    {
      id: 'meeting-scheduling',
      title: 'Meeting Scheduling',
      description: 'Coordinate and schedule meetings with contacts',
      icon: <CalendarClock className="h-8 w-8" />,
      color: 'text-orange-500'
    },
    {
      id: 'announcement',
      title: 'General Announcement',
      description: 'Share important information or announcements with your contacts',
      icon: <Megaphone className="h-8 w-8" />,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Campaign Type</h2>
        <p className="text-muted-foreground mt-2">
          Select the type of campaign you want to create
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignTypes.map((type) => (
          <Card 
            key={type.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary hover:shadow-md",
              selectedType === type.id && "border-primary border-2 bg-primary/5"
            )}
            onClick={() => onSelect(type.id)}
          >
            <CardHeader className="pb-2">
              <div className={cn("mb-2", type.color)}>
                {type.icon}
              </div>
              <CardTitle>{type.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignTypeSelector;
