
import React from 'react';
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

export type CampaignType = 
  | 'event-invitation' 
  | 'sales-outreach' 
  | 'follow-up-reminder' 
  | 'meeting-scheduling' 
  | 'announcement'
  | 'customer-feedback'
  | 'newsletter'
  | 'promotional'
  | 'seasonal'
  | 'survey'
  | 'webinar-invitation'
  | 'product-launch'
  | 'onboarding'
  | 'renewal'
  | 'order-confirmation';

export interface CampaignTypeInfo {
  id: CampaignType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const campaignTypes: CampaignTypeInfo[] = [
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
  },
  {
    id: 'customer-feedback',
    title: 'Customer Feedback',
    description: 'Collect feedback and insights from your customers',
    icon: <MessageSquare className="h-8 w-8" />,
    color: 'text-cyan-500'
  },
  {
    id: 'newsletter',
    title: 'Newsletter Campaign',
    description: 'Send regular updates and news to your contact list',
    icon: <Send className="h-8 w-8" />,
    color: 'text-indigo-500'
  },
  {
    id: 'promotional',
    title: 'Promotional Campaign',
    description: 'Send special offers, discounts, and promotions to drive sales',
    icon: <Gift className="h-8 w-8" />,
    color: 'text-pink-500'
  },
  {
    id: 'seasonal',
    title: 'Seasonal Greeting',
    description: 'Send holiday or seasonal greetings to maintain customer relationships',
    icon: <PartyPopper className="h-8 w-8" />,
    color: 'text-amber-500'
  },
  {
    id: 'survey',
    title: 'Survey Campaign',
    description: 'Collect data and insights through structured surveys',
    icon: <Clipboard className="h-8 w-8" />,
    color: 'text-emerald-500'
  },
  {
    id: 'webinar-invitation',
    title: 'Webinar Invitation',
    description: 'Invite contacts to attend your online webinar or presentation',
    icon: <Radio className="h-8 w-8" />,
    color: 'text-violet-500'
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Introduce and promote new products or services to your audience',
    icon: <ShoppingCart className="h-8 w-8" />,
    color: 'text-yellow-600'
  },
  {
    id: 'onboarding',
    title: 'Customer Onboarding',
    description: 'Guide new customers through your product or service setup process',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'text-blue-700'
  },
  {
    id: 'renewal',
    title: 'Subscription Renewal',
    description: 'Remind customers about upcoming renewals and encourage continuation',
    icon: <Award className="h-8 w-8" />,
    color: 'text-teal-600'
  },
  {
    id: 'order-confirmation',
    title: 'Order Confirmation',
    description: 'Confirm orders and provide tracking information to customers',
    icon: <Truck className="h-8 w-8" />,
    color: 'text-slate-700'
  }
];
