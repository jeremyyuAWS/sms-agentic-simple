
import React, { useState } from 'react';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CalendarClock, 
  PartyPopper, 
  Megaphone, 
  MessageSquare, 
  ListChecks,
  HandshakeIcon,
  Sparkles,
  Building,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define template categories
type TemplateCategory = 'outreach' | 'event' | 'followup' | 'announcement';

// Define campaign template structure
interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: React.ReactNode;
  messageTemplateBody: string;
  variables: string[];
  followUps?: {
    delayDays: number;
    body: string;
    condition: 'no-response' | 'all';
  }[];
  tags?: string[];
}

// Sample campaign templates
const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'welcome-series',
    name: 'Welcome Series',
    description: 'Introduce yourself and your business to new contacts with a warm welcome sequence.',
    category: 'outreach',
    icon: <Sparkles className="h-10 w-10 text-blue-500" />,
    messageTemplateBody: "Hi {name}, I'm {sender_name} from {company}. I'd love to welcome you to our community and learn more about your business needs. Would you have 15 minutes this week for a quick introduction?",
    variables: ['name', 'sender_name', 'company'],
    followUps: [
      {
        delayDays: 3,
        body: "Hi {name}, I wanted to follow up on my previous message. I'd still love to connect and learn more about how {company} might help with your goals.",
        condition: 'no-response'
      },
      {
        delayDays: 7,
        body: "Hi {name}, just checking in one last time. If you're interested in learning more about {company}, feel free to reach out anytime.",
        condition: 'no-response'
      }
    ],
    tags: ['Welcome', 'Introduction', 'New Contact']
  },
  {
    id: 'follow-up-meeting',
    name: 'Follow-up After Meeting',
    description: 'Send a timely follow-up after meeting with a potential client or contact.',
    category: 'followup',
    icon: <HandshakeIcon className="h-10 w-10 text-green-500" />,
    messageTemplateBody: "Hi {name}, great meeting you at {event_name}! As promised, I'm sending you the {resource} we discussed. Let me know if you have any questions.",
    variables: ['name', 'event_name', 'resource'],
    followUps: [
      {
        delayDays: 2,
        body: "Hi {name}, I wanted to check if you had a chance to review the {resource} I sent. I'd be happy to schedule a call to discuss next steps.",
        condition: 'no-response'
      }
    ],
    tags: ['Meeting Follow-up', 'Networking']
  },
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    description: 'Invite contacts to an upcoming webinar, conference, or other event.',
    category: 'event',
    icon: <CalendarClock className="h-10 w-10 text-purple-500" />,
    messageTemplateBody: "Hi {name}, I'd like to invite you to {event_name} on {event_date} at {event_time}. This {event_type} will cover {event_topic}. Would you be interested in attending?",
    variables: ['name', 'event_name', 'event_date', 'event_time', 'event_type', 'event_topic'],
    followUps: [
      {
        delayDays: 3,
        body: "Hi {name}, I'm following up about the {event_name} on {event_date}. Spots are filling up quickly, and I wanted to make sure you had the opportunity to register if you're interested.",
        condition: 'no-response'
      }
    ],
    tags: ['Event', 'Invitation']
  },
  {
    id: 'product-announcement',
    name: 'Product Announcement',
    description: 'Share news about a new product, feature, or service with your contacts.',
    category: 'announcement',
    icon: <Megaphone className="h-10 w-10 text-amber-500" />,
    messageTemplateBody: "Hi {name}, I'm excited to share that we've just launched {product_name}! This new {product_type} will help you {benefit}. Would you like to schedule a quick demo?",
    variables: ['name', 'product_name', 'product_type', 'benefit'],
    followUps: [
      {
        delayDays: 4,
        body: "Hi {name}, I wanted to follow up about our new {product_name}. Several of our clients are already seeing great results with it. Would you be interested in a 15-minute demo?",
        condition: 'no-response'
      }
    ],
    tags: ['Product', 'Announcement', 'Launch']
  },
  {
    id: 'conference-networking',
    name: 'Conference Networking',
    description: 'Connect with people you met at conferences or industry events.',
    category: 'outreach',
    icon: <Users className="h-10 w-10 text-indigo-500" />,
    messageTemplateBody: "Hi {name}, it was great connecting with you at {conference_name}! I enjoyed our conversation about {topic}. I'd love to continue our discussion - would you be available for a quick call next week?",
    variables: ['name', 'conference_name', 'topic'],
    tags: ['Conference', 'Networking', 'Event']
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Request',
    description: 'Ask existing customers for feedback on your product or service.',
    category: 'followup',
    icon: <MessageSquare className="h-10 w-10 text-pink-500" />,
    messageTemplateBody: "Hi {name}, thank you for being a valued customer of {company}. We're constantly working to improve, and your feedback would be incredibly helpful. Could you share your thoughts on your experience with {product_name}?",
    variables: ['name', 'company', 'product_name'],
    tags: ['Feedback', 'Customer', 'Research']
  }
];

interface TemplateSelectorProps {
  onSelect: (template: CampaignTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('outreach');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template.id);
    onSelect(template);
  };

  const getCategoryIcon = (category: TemplateCategory) => {
    switch (category) {
      case 'outreach':
        return <UserCheck className="h-4 w-4" />;
      case 'event':
        return <PartyPopper className="h-4 w-4" />;
      case 'followup':
        return <ListChecks className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Filter templates by category
  const filteredTemplates = campaignTemplates.filter(
    template => selectedCategory === template.category
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Campaign Templates</h2>
        <p className="text-muted-foreground">
          Choose a template to get started quickly with pre-defined campaign settings.
        </p>
      </div>

      <Tabs defaultValue="outreach" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TemplateCategory)}>
        <TabsList className="mb-4">
          <TabsTrigger value="outreach" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Outreach
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-2">
            <PartyPopper className="h-4 w-4" />
            Event
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Follow-up
          </TabsTrigger>
          <TabsTrigger value="announcement" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcement
          </TabsTrigger>
        </TabsList>

        {/* Template cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary hover:shadow-md",
                selectedTemplate === template.id && "border-primary border-2 bg-primary/5"
              )}
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    {template.icon}
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(template.category)}
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="mt-3">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm mb-2">
                  <div className="font-medium">Initial message:</div>
                  <div className="text-muted-foreground line-clamp-2 mt-1 italic">
                    "{template.messageTemplateBody}"
                  </div>
                </div>
                
                {template.followUps && template.followUps.length > 0 && (
                  <div className="text-sm">
                    <div className="font-medium">Includes {template.followUps.length} follow-up{template.followUps.length !== 1 ? 's' : ''}</div>
                  </div>
                )}

                {template.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template);
                  }}
                >
                  {selectedTemplate === template.id ? "Selected" : "Use Template"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No templates available</h3>
            <p className="text-muted-foreground mt-2">There are no templates in this category yet.</p>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default TemplateSelector;
