
import React from 'react';
import { CampaignGoal, CampaignGoalType } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  BarChart3,
  CalendarClock,
  CalendarHeart,
  ListChecks,
  Mail,
  MessageSquareHeart,
  Users,
  PencilRuler,
  AlertCircle,
  MessageSquare,
  BadgePercent,
  Megaphone,
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface CampaignGoalSelectorProps {
  value: CampaignGoal | undefined;
  onChange: (goal: CampaignGoal) => void;
}

// Define goal types with descriptions and icons
const goalTypes: {
  value: CampaignGoalType;
  label: string;
  description: string;
  icon: React.ReactNode;
  suggestedResponseRate?: number;
}[] = [
  {
    value: 'lead-generation',
    label: 'Lead Generation',
    description: 'Generate new leads and prospects for your sales pipeline',
    icon: <Users className="h-4 w-4" />,
    suggestedResponseRate: 0.15,
  },
  {
    value: 'sales',
    label: 'Sales Outreach',
    description: 'Direct sales outreach to convert prospects into customers',
    icon: <BadgePercent className="h-4 w-4" />,
    suggestedResponseRate: 0.2,
  },
  {
    value: 'event-promotion',
    label: 'Event Promotion',
    description: 'Promote an upcoming event and drive registrations',
    icon: <CalendarHeart className="h-4 w-4" />,
    suggestedResponseRate: 0.25,
  },
  {
    value: 'customer-feedback',
    label: 'Customer Feedback',
    description: 'Collect feedback from existing customers',
    icon: <MessageSquareHeart className="h-4 w-4" />,
    suggestedResponseRate: 0.35,
  },
  {
    value: 'event-follow-up',
    label: 'Event Follow-up',
    description: 'Follow up with contacts after an event',
    icon: <CalendarClock className="h-4 w-4" />,
    suggestedResponseRate: 0.3,
  },
  {
    value: 'product-announcement',
    label: 'Product Announcement',
    description: 'Announce a new product or feature to your customers',
    icon: <Megaphone className="h-4 w-4" />,
    suggestedResponseRate: 0.25,
  },
  {
    value: 'survey',
    label: 'Survey',
    description: 'Conduct a survey for market research or customer satisfaction',
    icon: <ListChecks className="h-4 w-4" />,
    suggestedResponseRate: 0.2,
  },
  {
    value: 'webinar-invitation',
    label: 'Webinar Invitation',
    description: 'Invite contacts to attend a webinar',
    icon: <Mail className="h-4 w-4" />,
    suggestedResponseRate: 0.22,
  },
  {
    value: 'newsletter',
    label: 'Newsletter Opt-in',
    description: 'Get contacts to subscribe to your newsletter',
    icon: <MessageSquare className="h-4 w-4" />,
    suggestedResponseRate: 0.18,
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Custom campaign goal',
    icon: <PencilRuler className="h-4 w-4" />,
  },
];

const CampaignGoalSelector: React.FC<CampaignGoalSelectorProps> = ({ value, onChange }) => {
  const selectedGoal = goalTypes.find(goal => goal.value === value?.type) || goalTypes[0];

  const handleGoalTypeChange = (type: CampaignGoalType) => {
    const goalType = goalTypes.find(g => g.value === type);
    
    onChange({
      type,
      description: value?.description || '',
      targetMetrics: {
        responseRate: goalType?.suggestedResponseRate || value?.targetMetrics?.responseRate || 0.2,
        conversionRate: value?.targetMetrics?.conversionRate || 0.1,
        completionDays: value?.targetMetrics?.completionDays || 14,
      },
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...value!,
      description: e.target.value,
    });
  };

  const handleMetricChange = (metric: keyof Required<CampaignGoal>['targetMetrics'], value: number) => {
    onChange({
      ...value!,
      targetMetrics: {
        ...value?.targetMetrics,
        [metric]: value,
      },
    });
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Campaign Goal
        </CardTitle>
        <CardDescription>
          Define the primary goal of your campaign to help optimize your outreach
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal-type">Goal Type</Label>
          <Select 
            value={value?.type || 'lead-generation'} 
            onValueChange={type => handleGoalTypeChange(type as CampaignGoalType)}
          >
            <SelectTrigger id="goal-type" className="w-full">
              <SelectValue placeholder="Select a goal type" />
            </SelectTrigger>
            <SelectContent>
              {goalTypes.map(goal => (
                <SelectItem key={goal.value} value={goal.value}>
                  <div className="flex items-center gap-2">
                    {goal.icon}
                    <span>{goal.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedGoal && (
          <div className="bg-muted/40 rounded-md p-3 mt-2 space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 p-2 rounded-md mt-0.5">
                {selectedGoal.icon}
              </div>
              <div>
                <h4 className="font-medium text-sm">{selectedGoal.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedGoal.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Label htmlFor="goal-description">Specific Goal (Optional)</Label>
          <Textarea
            id="goal-description"
            placeholder="Describe your specific goal for this campaign"
            value={value?.description || ''}
            onChange={handleDescriptionChange}
            className="resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Label>Target Metrics</Label>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Target Response Rate</span>
                <Badge variant="outline">
                  {(value?.targetMetrics?.responseRate ? value.targetMetrics.responseRate * 100 : 20).toFixed(0)}%
                </Badge>
              </div>
              <Slider
                value={[value?.targetMetrics?.responseRate ? value.targetMetrics.responseRate * 100 : 20]}
                min={1}
                max={50}
                step={1}
                onValueChange={values => handleMetricChange('responseRate', values[0] / 100)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Target Conversion Rate</span>
                <Badge variant="outline">
                  {(value?.targetMetrics?.conversionRate ? value.targetMetrics.conversionRate * 100 : 10).toFixed(0)}%
                </Badge>
              </div>
              <Slider
                value={[value?.targetMetrics?.conversionRate ? value.targetMetrics.conversionRate * 100 : 10]}
                min={1}
                max={40}
                step={1}
                onValueChange={values => handleMetricChange('conversionRate', values[0] / 100)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Campaign Duration (Days)</span>
                <Badge variant="outline">
                  {value?.targetMetrics?.completionDays || 14} days
                </Badge>
              </div>
              <Slider
                value={[value?.targetMetrics?.completionDays || 14]}
                min={1}
                max={60}
                step={1}
                onValueChange={values => handleMetricChange('completionDays', values[0])}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                Setting clear goals will help us optimize your campaign and provide more relevant analytics.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignGoalSelector;
