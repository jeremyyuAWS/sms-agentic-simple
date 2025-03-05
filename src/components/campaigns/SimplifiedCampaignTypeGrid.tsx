
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarClock, 
  Users, 
  Bell, 
  Calendar, 
  Megaphone, 
  MessageSquare, 
  Radio, 
  Gift, 
  PartyPopper,
  Send,
  Clipboard,
  BookOpen,
  ShoppingCart,
  Award,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignType } from './CampaignTypeSelector';

interface CampaignTypeInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface SimplifiedCampaignTypeGridProps {
  onSelect: (type: CampaignType) => void;
}

const SimplifiedCampaignTypeGrid: React.FC<SimplifiedCampaignTypeGridProps> = ({ 
  onSelect 
}) => {
  const campaignTypes: CampaignTypeInfo[] = [
    {
      id: 'event-invitation',
      title: 'Event Invitation',
      description: 'Invite contacts to upcoming events, webinars, or conferences',
      icon: <Calendar className="h-10 w-10" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'sales-outreach',
      title: 'Sales Outreach',
      description: 'Connect with potential customers to promote products or services',
      icon: <Users className="h-10 w-10" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'follow-up-reminder',
      title: 'Follow-Up Reminder',
      description: 'Send reminders to contacts who haven\'t responded to previous messages',
      icon: <Bell className="h-10 w-10" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'meeting-scheduling',
      title: 'Meeting Scheduling',
      description: 'Coordinate and schedule meetings with prospects or clients',
      icon: <CalendarClock className="h-10 w-10" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'announcement',
      title: 'General Announcement',
      description: 'Share important information or announcements with your audience',
      icon: <Megaphone className="h-10 w-10" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 'customer-feedback',
      title: 'Customer Feedback',
      description: 'Collect feedback and insights from your customers',
      icon: <MessageSquare className="h-10 w-10" />,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'newsletter',
      title: 'Newsletter Campaign',
      description: 'Send regular updates and news to your contact list',
      icon: <Send className="h-10 w-10" />,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'promotional',
      title: 'Promotional Campaign',
      description: 'Send special offers, discounts, and promotions to drive sales',
      icon: <Gift className="h-10 w-10" />,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'seasonal',
      title: 'Seasonal Greeting',
      description: 'Send holiday or seasonal greetings to maintain customer relationships',
      icon: <PartyPopper className="h-10 w-10" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      id: 'survey',
      title: 'Survey Campaign',
      description: 'Collect data and insights through structured surveys',
      icon: <Clipboard className="h-10 w-10" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'webinar-invitation',
      title: 'Webinar Invitation',
      description: 'Invite contacts to attend your online webinar or presentation',
      icon: <Radio className="h-10 w-10" />,
      color: 'text-violet-500',
      bgColor: 'bg-violet-50'
    },
    {
      id: 'product-launch',
      title: 'Product Launch',
      description: 'Introduce and promote new products or services to your audience',
      icon: <ShoppingCart className="h-10 w-10" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'onboarding',
      title: 'Customer Onboarding',
      description: 'Guide new customers through your product or service setup process',
      icon: <BookOpen className="h-10 w-10" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'renewal',
      title: 'Subscription Renewal',
      description: 'Remind customers about upcoming renewals and encourage continuation',
      icon: <Award className="h-10 w-10" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'order-confirmation',
      title: 'Order Confirmation',
      description: 'Confirm orders and provide tracking information to customers',
      icon: <Truck className="h-10 w-10" />,
      color: 'text-slate-700',
      bgColor: 'bg-slate-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Campaign Type</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Select the type of campaign that best fits your outreach goals
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {campaignTypes.map((type) => (
          <Card 
            key={type.id}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-md overflow-hidden group h-full"
            onClick={() => onSelect(type.id as CampaignType)}
          >
            <div className={`h-2 w-full ${type.bgColor} border-b ${type.color.replace('text-', 'border-')}`}></div>
            <CardHeader className="pb-2 space-y-3">
              <div className={`p-3 rounded-full ${type.bgColor} ${type.color} w-fit mb-0 transition-transform group-hover:scale-110`}>
                {type.icon}
              </div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-sm ${type.color} hover:${type.bgColor}`}
              >
                Select This Campaign Type
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimplifiedCampaignTypeGrid;
