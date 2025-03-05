
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Check, HelpCircle } from 'lucide-react';
import { CampaignType } from './CampaignTypeSelector';

interface CampaignSetupGuideProps {
  campaignType: CampaignType;
  currentStep: string;
}

const CampaignSetupGuide: React.FC<CampaignSetupGuideProps> = ({
  campaignType,
  currentStep
}) => {
  // Campaign type specific guidance
  const getGuidance = (): { [key: string]: string } => {
    const commonGuidance = {
      'details': 'Campaign information has been pre-filled based on your selected campaign type.',
      'contacts': 'Select the contacts or lists you want to target with this campaign.',
      'template': 'Choose from recommended message templates for this campaign type.',
      'schedule': 'We\'ve suggested optimal sending times based on your campaign type.',
      'followups': 'Pre-configured follow-up sequences have been added to maximize response rates.'
    };
    
    const typeSpecificGuidance: Record<CampaignType, { [key: string]: string }> = {
      'event-invitation': {
        'details': 'We\'ve set up an event invitation campaign with best practices.',
        'template': 'Choose an invitation template that includes event details, date, and location.',
        'schedule': 'For event invitations, we recommend sending at least 1-2 weeks before the event.',
        'followups': 'A reminder follow-up has been configured for 2 days before the event.'
      },
      'sales-outreach': {
        'details': 'This sales outreach campaign is optimized for initial product conversations.',
        'template': 'Select a template that highlights your value proposition and includes a clear call to action.',
        'schedule': 'Business hours are pre-configured for optimal response rates.',
        'followups': 'A 3-day follow-up is included to increase engagement.'
      },
      'follow-up-reminder': {
        'details': 'This campaign will help you reconnect with contacts who haven\'t responded.',
        'template': 'Choose a gentle reminder template that references your previous communication.',
        'followups': 'Multiple follow-ups are configured at strategic intervals.'
      },
      'meeting-scheduling': {
        'details': 'This campaign is designed to help you schedule meetings efficiently.',
        'template': 'Select a template that offers specific time slots or includes your calendar link.',
        'schedule': 'We\'ve pre-configured business hours for scheduling.',
        'followups': 'A quick 2-day follow-up is included for non-responders.'
      },
      'announcement': {
        'details': 'This campaign will help you share important company information with your audience.',
        'template': 'Choose a template with a clear, concise announcement format.',
        'schedule': 'Morning hours are recommended for announcements.'
      },
      'customer-feedback': {
        'details': 'This campaign will help you collect valuable feedback from customers.',
        'template': 'Select a template that includes specific questions or a survey link.',
        'followups': 'A gentle reminder is configured for those who don\'t respond initially.'
      },
      'newsletter': {
        'details': 'This campaign is set up for regular updates to your audience.',
        'template': 'Choose a newsletter template with sections for different types of content.',
        'schedule': 'Tuesday or Thursday mornings are pre-configured for optimal open rates.'
      },
      'promotional': {
        'details': 'This campaign is optimized for promotional offers and discounts.',
        'template': 'Select a template that clearly highlights your offer and includes a deadline.',
        'schedule': 'Afternoon and evening hours are pre-configured for promotional messages.',
        'followups': 'A deadline reminder follow-up is included.'
      },
      'seasonal': {
        'details': 'This campaign is perfect for holiday or seasonal greetings.',
        'template': 'Choose a template with warm, personalized seasonal messaging.',
        'schedule': 'Morning delivery is pre-configured for greeting messages.'
      },
      'survey': {
        'details': 'This campaign is designed to collect structured feedback through surveys.',
        'template': 'Select a template that explains the survey purpose and includes your survey link.',
        'followups': 'A 3-day reminder is included for those who haven\'t completed the survey.'
      },
      'webinar-invitation': {
        'details': 'This campaign will help you promote your upcoming webinar.',
        'template': 'Choose a template that includes webinar topic, date, time, and registration link.',
        'schedule': 'Send at least 1 week before with a reminder closer to the event.',
        'followups': 'A day-before reminder has been configured.'
      },
      'product-launch': {
        'details': 'This campaign is designed to announce and promote your new product launch.',
        'template': 'Select a template that highlights key features and benefits of your new product.',
        'schedule': 'We recommend scheduling 1-2 weeks before launch with multiple follow-ups.',
        'followups': 'A multi-step sequence is included to build anticipation and engagement.'
      },
      'onboarding': {
        'details': 'This campaign will guide new customers through your product or service.',
        'template': 'Choose a template that welcomes new users and provides initial instructions.',
        'schedule': 'An immediate welcome message with scheduled follow-ups is pre-configured.',
        'followups': 'A comprehensive 5-step onboarding sequence has been prepared.'
      },
      'renewal': {
        'details': 'This campaign helps remind customers about upcoming subscription renewals.',
        'template': 'Select a template that emphasizes the value they\'ve received and renewal benefits.',
        'schedule': 'We suggest sending 30 days before renewal with strategic follow-ups.',
        'followups': 'Multiple reminders at decreasing intervals as the renewal date approaches.'
      },
      'order-confirmation': {
        'details': 'This campaign provides order confirmations and shipping updates to customers.',
        'template': 'Choose a template with clear order details and tracking information.',
        'schedule': 'Immediate confirmation with shipping update follow-ups is pre-configured.',
        'followups': 'Automated shipping and delivery notification follow-ups are included.'
      }
    };
    
    return {
      ...commonGuidance,
      ...(typeSpecificGuidance[campaignType] || {})
    };
  };
  
  const guidance = getGuidance();
  const currentTip = guidance[currentStep] || 'Complete each step to set up your campaign.';
  
  return (
    <Card className="bg-blue-50 border-blue-100 mb-4">
      <CardContent className="pt-4 pb-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-blue-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-blue-800">{currentTip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupGuide;
