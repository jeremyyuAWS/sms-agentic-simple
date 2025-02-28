
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, CalendarClock, Calendar, ArrowDown } from 'lucide-react';
import { CampaignType } from './CampaignTypeSelector';
import { Template } from '@/lib/types';

interface RecommendedTemplatesListProps {
  campaignType: CampaignType;
  templates: Template[];
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

const RecommendedTemplatesList: React.FC<RecommendedTemplatesListProps> = ({
  campaignType,
  templates,
  onSelectTemplate,
  selectedTemplateId
}) => {
  // Get keyword mapping for filtering templates
  const getTypeKeywords = (type: CampaignType): string[] => {
    const keywordMap: Record<CampaignType, string[]> = {
      'event-invitation': ['event', 'invitation', 'rsvp'],
      'sales-outreach': ['sales', 'outreach', 'product', 'service'],
      'follow-up-reminder': ['follow', 'reminder', 'check-in'],
      'meeting-scheduling': ['meeting', 'schedule', 'call', 'appointment'],
      'announcement': ['announcement', 'news', 'update'],
      'customer-feedback': ['feedback', 'review', 'opinion'],
      'newsletter': ['newsletter', 'update', 'monthly'],
      'promotional': ['promotion', 'discount', 'offer', 'sale'],
      'seasonal': ['seasonal', 'holiday', 'greeting'],
      'survey': ['survey', 'questionnaire', 'research'],
      'webinar-invitation': ['webinar', 'workshop', 'presentation']
    };
    
    return keywordMap[type] || [];
  };
  
  // Filter templates based on campaign type keywords
  const filteredTemplates = templates.filter(template => {
    const keywords = getTypeKeywords(campaignType);
    const nameAndBodyText = (template.name + ' ' + template.body).toLowerCase();
    
    return keywords.some(keyword => nameAndBodyText.includes(keyword.toLowerCase()));
  });
  
  // If no matching templates found, show some defaults
  const templatesToShow = filteredTemplates.length > 0 ? filteredTemplates : templates.slice(0, 3);
  
  // Get campaign type display name
  const getCampaignTypeDisplayName = (type: CampaignType): string => {
    const displayNames: Record<CampaignType, string> = {
      'event-invitation': 'Event Invitation',
      'sales-outreach': 'Sales Outreach',
      'follow-up-reminder': 'Follow-Up Reminder',
      'meeting-scheduling': 'Meeting Scheduling',
      'announcement': 'Announcement',
      'customer-feedback': 'Customer Feedback',
      'newsletter': 'Newsletter',
      'promotional': 'Promotional',
      'seasonal': 'Seasonal Greeting',
      'survey': 'Survey',
      'webinar-invitation': 'Webinar Invitation'
    };
    
    return displayNames[type] || type;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          Message Sequence for {getCampaignTypeDisplayName(campaignType)}
        </h3>
        <Badge variant="outline">{templatesToShow.length} templates</Badge>
      </div>
      
      {/* Vertical Flow Layout */}
      <div className="space-y-6">
        {templatesToShow.map((template, index) => (
          <div key={template.id} className="relative">
            {/* Step indicator */}
            <div className="absolute -left-2 top-6 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            
            {/* Connection line between cards */}
            {index < templatesToShow.length - 1 && (
              <div className="absolute left-2 top-[70px] h-12 w-0.5 bg-primary/20"></div>
            )}
            
            <Card 
              className={`ml-10 cursor-pointer transition-all ${
                selectedTemplateId === template.id ? 'border-primary shadow-md ring-1 ring-primary' : 'hover:border-primary hover:shadow-sm'
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {index === 0 ? 'Initial message' : `Follow-up message ${index}`}
                    </CardDescription>
                  </div>
                  {selectedTemplateId === template.id && (
                    <Badge variant="default" className="ml-auto">
                      <Check className="h-3 w-3 mr-1" /> Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {template.body}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(template.createdAt).toLocaleDateString()}
                </div>
                <Button 
                  variant={selectedTemplateId === template.id ? "default" : "ghost"} 
                  size="sm"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplateId === template.id ? 'Selected' : 'Select'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Arrow between cards */}
            {index < templatesToShow.length - 1 && (
              <div className="flex justify-center ml-10 my-1">
                <ArrowDown className="text-primary h-5 w-5" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {templatesToShow.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No matching templates found for this campaign type.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedTemplatesList;
