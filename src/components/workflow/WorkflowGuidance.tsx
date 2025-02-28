
import React from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/app/AppContext';
import { useToast } from '@/hooks/use-toast';
import { WorkflowState } from '@/contexts/app/types';

export const WorkflowGuidance: React.FC = () => {
  const { workflow, continueWorkflow, updateWorkflowData, cancelWorkflow } = useApp();
  const { toast } = useToast();
  
  if (!workflow.active) return null;
  
  type StepContent = {
    title: string;
    description: string;
    nextLabel: string;
    canContinue: boolean;
    nextStep: WorkflowState['currentStep'];
  };
  
  const getStepContent = (): StepContent => {
    switch (workflow.currentStep) {
      case 'contacts':
        return {
          title: 'Select your contacts',
          description: 'Upload a CSV file or select an existing contact list to target with your campaign.',
          nextLabel: workflow.contactsData ? 'Continue to Templates' : 'Please select contacts first',
          canContinue: !!workflow.contactsData,
          nextStep: 'template'
        };
      case 'template':
        return {
          title: 'Choose a message template',
          description: 'Select an existing template or create a new one for your outreach campaign.',
          nextLabel: workflow.templateData ? 'Continue to Campaign Setup' : 'Please select a template first',
          canContinue: !!workflow.templateData,
          nextStep: 'campaign'
        };
      case 'campaign':
        return {
          title: 'Configure your campaign',
          description: 'Give your campaign a name and description, and add any knowledge bases to help with responses.',
          nextLabel: workflow.campaignData?.name ? 'Continue to Schedule' : 'Please configure your campaign first',
          canContinue: !!workflow.campaignData?.name,
          nextStep: 'schedule'
        };
      case 'schedule':
        return {
          title: 'Set your sending schedule',
          description: 'Choose when to start sending messages and set any time window constraints.',
          nextLabel: 'Continue to Review',
          canContinue: true, // Schedule is optional
          nextStep: 'review'
        };
      case 'review':
        return {
          title: 'Review and launch',
          description: 'Review your campaign settings before launching.',
          nextLabel: 'Launch Campaign',
          canContinue: true,
          nextStep: 'review' // There's no next step, this will complete the workflow
        };
      default:
        return {
          title: 'Campaign setup',
          description: 'Follow the steps to create your campaign.',
          nextLabel: 'Continue',
          canContinue: false,
          nextStep: 'contacts'
        };
    }
  };
  
  const content = getStepContent();
  
  const handleContinue = () => {
    if (workflow.currentStep === 'review') {
      // This is the last step, complete the workflow
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully and is ready to launch.",
      });
      return;
    }
    
    continueWorkflow(content.nextStep);
  };
  
  const handleCancel = () => {
    toast({
      title: "Workflow Cancelled",
      description: "You've exited the campaign creation workflow. Your progress has been saved as a draft.",
    });
    cancelWorkflow();
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <HelpCircle className="mr-2 h-5 w-5 text-primary" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Save as Draft
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!content.canContinue}
        >
          {content.nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
