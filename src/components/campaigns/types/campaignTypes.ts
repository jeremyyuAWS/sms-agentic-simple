
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

const createIcon = (Icon: React.FC<React.SVGProps<SVGSVGElement>>) => 
  React.createElement(Icon, { className: "h-8 w-8" });

export const campaignTypes: CampaignTypeInfo[] = [
  {
    id: 'event-invitation',
    title: 'Event Invitation',
    description: 'Invite contacts to an upcoming event, webinar, or conference',
    icon: createIcon(Calendar),
    color: 'text-blue-500'
  },
  {
    id: 'sales-outreach',
    title: 'Sales Outreach',
    description: 'Connect with potential customers to promote your products or services',
    icon: createIcon(Users),
    color: 'text-green-500'
  },
  {
    id: 'follow-up-reminder',
    title: 'Follow-Up Reminder',
    description: 'Send reminders to contacts who have not responded to previous messages',
    icon: createIcon(Bell),
    color: 'text-purple-500'
  },
  {
    id: 'meeting-scheduling',
    title: 'Meeting Scheduling',
    description: 'Coordinate and schedule meetings with contacts',
    icon: createIcon(CalendarClock),
    color: 'text-orange-500'
  },
  {
    id: 'announcement',
    title: 'General Announcement',
    description: 'Share important information or announcements with your contacts',
    icon: createIcon(Megaphone),
    color: 'text-red-500'
  },
  {
    id: 'customer-feedback',
    title: 'Customer Feedback',
    description: 'Collect feedback and insights from your customers',
    icon: createIcon(MessageSquare),
    color: 'text-cyan-500'
  },
  {
    id: 'newsletter',
    title: 'Newsletter Campaign',
    description: 'Send regular updates and news to your contact list',
    icon: createIcon(Send),
    color: 'text-indigo-500'
  },
  {
    id: 'promotional',
    title: 'Promotional Campaign',
    description: 'Send special offers, discounts, and promotions to drive sales',
    icon: createIcon(Gift),
    color: 'text-pink-500'
  },
  {
    id: 'seasonal',
    title: 'Seasonal Greeting',
    description: 'Send holiday or seasonal greetings to maintain customer relationships',
    icon: createIcon(PartyPopper),
    color: 'text-amber-500'
  },
  {
    id: 'survey',
    title: 'Survey Campaign',
    description: 'Collect data and insights through structured surveys',
    icon: createIcon(Clipboard),
    color: 'text-emerald-500'
  },
  {
    id: 'webinar-invitation',
    title: 'Webinar Invitation',
    description: 'Invite contacts to attend your online webinar or presentation',
    icon: createIcon(Radio),
    color: 'text-violet-500'
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Introduce and promote new products or services to your audience',
    icon: createIcon(ShoppingCart),
    color: 'text-yellow-600'
  },
  {
    id: 'onboarding',
    title: 'Customer Onboarding',
    description: 'Guide new customers through your product or service setup process',
    icon: createIcon(BookOpen),
    color: 'text-blue-700'
  },
  {
    id: 'renewal',
    title: 'Subscription Renewal',
    description: 'Remind customers about upcoming renewals and encourage continuation',
    icon: createIcon(Award),
    color: 'text-teal-600'
  },
  {
    id: 'order-confirmation',
    title: 'Order Confirmation',
    description: 'Confirm orders and provide tracking information to customers',
    icon: createIcon(Truck),
    color: 'text-slate-700'
  }
];
