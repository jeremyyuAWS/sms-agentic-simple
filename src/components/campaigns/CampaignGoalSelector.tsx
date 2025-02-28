
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PhoneIcon, 
  Calendar, 
  Users, 
  PartyPopper, 
  Megaphone, 
  MessageSquare, 
  FileCheck,
  BarChart 
} from 'lucide-react';
import { CampaignGoal, CampaignGoalType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CampaignGoalSelectorProps {
  goal?: CampaignGoal;
  onGoalChange: (goal: CampaignGoal) => void;
}

const CampaignGoalSelector: React.FC<CampaignGoalSelectorProps> = ({ 
  goal, 
  onGoalChange 
}) => {
  const goalOptions: {
    type: CampaignGoalType;
    title: string;
    description: string;
    icon: React.ReactNode;
    metrics?: {
      responseRate?: number;
      conversionRate?: number;
      completionDays?: number;
    };
  }[] = [
    {
      type: 'lead-generation',
      title: 'Lead Generation',
      description: 'Generate new leads and start conversations with potential customers',
      icon: <Users className="h-10 w-10 text-blue-500" />,
      metrics: {
        responseRate: 15,
        conversionRate: 5,
        completionDays: 14
      }
    },
    {
      type: 'sales',
      title: 'Sales Outreach',
      description: 'Connect with potential customers to promote your products or services',
      icon: <PhoneIcon className="h-10 w-10 text-green-500" />,
      metrics: {
        responseRate: 20,
        conversionRate: 10,
        completionDays: 7
      }
    },
    {
      type: 'event-promotion',
      title: 'Event Promotion',
      description: 'Invite contacts to upcoming events, webinars, or conferences',
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      metrics: {
        responseRate: 25,
        conversionRate: 15,
        completionDays: 14
      }
    },
    {
      type: 'customer-feedback',
      title: 'Customer Feedback',
      description: 'Collect feedback from existing customers about your product or service',
      icon: <MessageSquare className="h-10 w-10 text-pink-500" />,
      metrics: {
        responseRate: 30,
        conversionRate: 20,
        completionDays: 7
      }
    },
    {
      type: 'event-follow-up',
      title: 'Event Follow-up',
      description: 'Follow up with contacts after an event or webinar',
      icon: <PartyPopper className="h-10 w-10 text-yellow-500" />,
      metrics: {
        responseRate: 35,
        conversionRate: 15,
        completionDays: 3
      }
    },
    {
      type: 'product-announcement',
      title: 'Product Announcement',
      description: 'Announce new products or features to your contacts',
      icon: <Megaphone className="h-10 w-10 text-orange-500" />,
      metrics: {
        responseRate: 20,
        conversionRate: 5,
        completionDays: 7
      }
    },
    {
      type: 'survey',
      title: 'Survey',
      description: 'Send a survey to collect data and insights from your contacts',
      icon: <FileCheck className="h-10 w-10 text-indigo-500" />,
      metrics: {
        responseRate: 15,
        conversionRate: 10,
        completionDays: 14
      }
    },
    {
      type: 'other',
      title: 'Other',
      description: 'Create a custom campaign with your own goals',
      icon: <BarChart className="h-10 w-10 text-gray-500" />
    }
  ];

  const handleSelect = (selectedGoal: CampaignGoalType) => {
    const selectedOption = goalOptions.find(option => option.type === selectedGoal);
    
    onGoalChange({
      type: selectedGoal,
      description: selectedOption?.description,
      targetMetrics: selectedOption?.metrics
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Campaign Goal</h2>
        <p className="text-muted-foreground">
          Select a goal for your campaign to help track its success.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goalOptions.map((option) => (
          <Card 
            key={option.type}
            className={cn(
              "cursor-pointer transition-all hover:border-primary hover:shadow-md",
              goal?.type === option.type && "border-primary border-2 bg-primary/5"
            )}
            onClick={() => handleSelect(option.type)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>{option.icon}</div>
                {option.metrics && (
                  <Badge variant="outline" className="text-xs">
                    {option.metrics.responseRate}% Response Rate
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-3">{option.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {option.description}
              </p>
              
              {option.metrics && (
                <div className="text-xs space-y-1 text-muted-foreground">
                  {option.metrics.conversionRate && (
                    <div>Target Conversion: {option.metrics.conversionRate}%</div>
                  )}
                  {option.metrics.completionDays && (
                    <div>Completion: {option.metrics.completionDays} days</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignGoalSelector;
