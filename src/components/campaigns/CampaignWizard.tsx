
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import CampaignTypeSelector, { CampaignType } from './CampaignTypeSelector';
import ContactListSelector from './ContactListSelector';
import CampaignMessageEditor from './CampaignMessageEditor';
import SimplifiedScheduler from './SimplifiedScheduler';
import CampaignReview from './CampaignReview';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts';
import { Campaign } from '@/lib/types';
import { cn } from '@/lib/utils'; // Import the cn utility function

type WizardStep = 'type' | 'contacts' | 'message' | 'schedule' | 'review';

const steps: { id: WizardStep; title: string }[] = [
  { id: 'type', title: 'Campaign Type' },
  { id: 'contacts', title: 'Select Contacts' },
  { id: 'message', title: 'Customize Messages' },
  { id: 'schedule', title: 'Set Schedule' },
  { id: 'review', title: 'Review & Launch' },
];

interface CampaignWizardProps {
  onComplete: (campaignData: Partial<Campaign>) => void;
  onCancel: () => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ onComplete, onCancel }) => {
  const { toast } = useToast();
  const { contacts, contactLists } = useApp();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [campaignType, setCampaignType] = useState<CampaignType | null>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | undefined>(undefined);
  const [messageContent, setMessageContent] = useState<string>('');
  const [followUpContent, setFollowUpContent] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [timeWindow, setTimeWindow] = useState<{start: string; end: string}>({ start: '9:00', end: '17:00' });
  const [avoidWeekends, setAvoidWeekends] = useState<boolean>(true);
  const [followUpDelay, setFollowUpDelay] = useState<number>(2);
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  // Navigate to next step
  const handleNext = () => {
    // Validate current step
    if (currentStep === 'type' && !campaignType) {
      toast({
        title: "Please select a campaign type",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 'contacts' && selectedContactIds.length === 0 && !selectedListId) {
      toast({
        title: "Please select contacts",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 'message' && !messageContent) {
      toast({
        title: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 'schedule' && !scheduledDate) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      });
      return;
    }
    
    // Move to next step
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    } else {
      // Complete the wizard
      handleComplete();
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id);
    }
  };
  
  // Complete the wizard
  const handleComplete = () => {
    const campaignData: Partial<Campaign> = {
      name: `${campaignType} Campaign`,
      description: `Created with the ${campaignType} template`,
      status: 'draft',
      contactIds: selectedContactIds,
      contactListId: selectedListId,
      scheduledStartDate: scheduledDate,
      timeZone: 'America/Los_Angeles', // Default timezone
      sendingWindow: timeWindow.start && timeWindow.end ? {
        startTime: timeWindow.start,
        endTime: timeWindow.end,
        daysOfWeek: avoidWeekends ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6],
      } : undefined,
      // Add template/message data
      templateId: '', // This will be auto-generated based on campaign type
      contactCount: selectedContactIds.length || 0,
      // Add follow-ups
      followUps: followUpContent ? [
        {
          id: `followup-${Date.now()}`,
          templateId: '', // Add required field
          delayDays: followUpDelay, // Changed from delayHours to delayDays to match type
          enabled: true, // Add required field
          condition: 'no-response', // Changed from triggerCondition to condition
        }
      ] : [],
    };
    
    onComplete(campaignData);
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <CampaignTypeSelector
            selectedType={campaignType}
            onSelect={setCampaignType}
          />
        );
      case 'contacts':
        return (
          <ContactListSelector
            selectedContactIds={selectedContactIds}
            selectedListId={selectedListId}
            onContactsSelect={setSelectedContactIds}
            onListSelect={setSelectedListId}
          />
        );
      case 'message':
        return (
          <CampaignMessageEditor
            campaignType={campaignType}
            messageContent={messageContent}
            followUpContent={followUpContent}
            onMessageChange={setMessageContent}
            onFollowUpChange={setFollowUpContent}
          />
        );
      case 'schedule':
        return (
          <SimplifiedScheduler
            scheduledDate={scheduledDate}
            timeWindow={timeWindow}
            avoidWeekends={avoidWeekends}
            followUpDelay={followUpDelay}
            onDateChange={setScheduledDate}
            onTimeWindowChange={setTimeWindow}
            onAvoidWeekendsChange={setAvoidWeekends}
            onFollowUpDelayChange={setFollowUpDelay}
          />
        );
      case 'review':
        return (
          <CampaignReview
            campaignType={campaignType}
            contactCount={selectedContactIds.length}
            listName={selectedListId ? contactLists.find(list => list.id === selectedListId)?.name : undefined}
            messagePreview={messageContent}
            followUpPreview={followUpContent}
            scheduledDate={scheduledDate}
            timeWindow={timeWindow}
            avoidWeekends={avoidWeekends}
            followUpDelay={followUpDelay}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mb-1",
                    currentStepIndex === index 
                      ? "bg-primary text-white" 
                      : currentStepIndex > index 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-200 text-gray-500"
                  )}
                >
                  {currentStepIndex > index ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs hidden sm:block",
                    currentStepIndex === index 
                      ? "text-primary font-medium" 
                      : currentStepIndex > index 
                        ? "text-green-500" 
                        : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStepIndex === 0 ? onCancel : handleBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {currentStepIndex === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button onClick={handleNext}>
            {currentStepIndex === steps.length - 1 ? 'Launch Campaign' : 'Continue'}
            {currentStepIndex < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignWizard;
