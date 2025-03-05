
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Template } from '@/lib/types';
import { CampaignType } from './CampaignTypeSelector';
import { Button } from '@/components/ui/button';

interface RecommendedTemplatesListProps {
  campaignType: CampaignType;
  templates: Template[];
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
}

const RecommendedTemplatesList: React.FC<RecommendedTemplatesListProps> = ({
  campaignType,
  templates,
  onSelect,
  selectedTemplateId
}) => {
  // Recommendations by campaign type
  const recommendationsByType: Record<CampaignType, string[]> = {
    'event-invitation': ['Event Invitation', 'Upcoming Event', 'Conference Invite', 'Webinar Registration'],
    'sales-outreach': ['Sales Introduction', 'Product Demo', 'Sales Follow-up', 'Discovery Call'],
    'follow-up-reminder': ['Gentle Reminder', 'Follow-up', 'Check-in', 'Progress Update'],
    'meeting-scheduling': ['Meeting Request', 'Calendar Invite', 'Meeting Confirmation', 'Scheduling Options'],
    'announcement': ['Company Announcement', 'Product Update', 'Important Notice', 'Announcement'],
    'customer-feedback': ['Feedback Request', 'Survey Invitation', 'Product Review', 'Service Feedback'],
    'newsletter': ['Monthly Newsletter', 'Weekly Update', 'Industry News', 'Newsletter'],
    'promotional': ['Special Offer', 'Limited Time Discount', 'Promotion', 'Exclusive Deal'],
    'seasonal': ['Holiday Greeting', 'Seasonal Offer', 'Holiday Sale', 'Seasonal Update'],
    'survey': ['Survey Invitation', 'Customer Survey', 'Feedback Survey', 'Market Research'],
    'webinar-invitation': ['Webinar Invitation', 'Online Seminar', 'Digital Workshop', 'Educational Event'],
    'product-launch': ['New Product Announcement', 'Product Launch', 'Feature Release', 'Innovation Reveal'],
    'onboarding': ['Welcome Message', 'Getting Started', 'Onboarding Guide', 'New User Welcome'],
    'renewal': ['Subscription Renewal', 'Renewal Reminder', 'Membership Renewal', 'Service Continuation'],
    'order-confirmation': ['Order Confirmation', 'Purchase Receipt', 'Shipping Notification', 'Delivery Update']
  };

  // Title recommendations by campaign type
  const titleRecommendations: Record<CampaignType, string> = {
    'event-invitation': 'Event Invitation Templates',
    'sales-outreach': 'Sales Outreach Templates',
    'follow-up-reminder': 'Follow-up Reminder Templates',
    'meeting-scheduling': 'Meeting Scheduling Templates',
    'announcement': 'Announcement Templates',
    'customer-feedback': 'Customer Feedback Templates',
    'newsletter': 'Newsletter Templates',
    'promotional': 'Promotional Templates',
    'seasonal': 'Seasonal Greeting Templates',
    'survey': 'Survey Templates',
    'webinar-invitation': 'Webinar Invitation Templates',
    'product-launch': 'Product Launch Templates',
    'onboarding': 'Customer Onboarding Templates',
    'renewal': 'Subscription Renewal Templates',
    'order-confirmation': 'Order Confirmation Templates'
  };

  // Get recommended template names for this campaign type
  const recommendedNames = recommendationsByType[campaignType] || [];
  
  // Filter templates that match recommended names for this campaign type
  const recommendedTemplates = templates.filter(template => 
    recommendedNames.some(name => 
      template.name.toLowerCase().includes(name.toLowerCase())
    )
  );
  
  // If no matches, return all templates
  const templatesToShow = recommendedTemplates.length > 0 ? recommendedTemplates : templates;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {titleRecommendations[campaignType] || 'Recommended Templates'}
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {templatesToShow.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedTemplateId === template.id ? 'border-primary border-2' : ''
            }`}
            onClick={() => onSelect(template.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.body.substring(0, 100)}...
              </p>
              <div className="mt-3">
                <Button 
                  variant={selectedTemplateId === template.id ? "default" : "outline"} 
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id);
                  }}
                >
                  {selectedTemplateId === template.id ? 'Selected' : 'Use This Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTemplatesList;
