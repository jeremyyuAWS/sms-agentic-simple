
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts';
import { Campaign, Template, Contact, KnowledgeBase, FollowUp } from '@/lib/types';
import CampaignContactSelection from './CampaignContactSelection';
import CSVUploader from './CSVUploader';
import ScheduleCampaign from './ScheduleCampaign';
import TemplateList from '@/components/templates/TemplateList';
import TemplateEditor from '@/components/templates/TemplateEditor';
import KnowledgeBaseList from '@/components/contacts/KnowledgeBaseList';
import CampaignDetailView from './CampaignDetailView';
import FollowUpFlowBuilder from './FollowUpFlowBuilder';
import { Check, ArrowRight, ListChecks, Calendar, Users, Pencil, BookOpen, MessageSquare, Save, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import CampaignGoalSelector from './CampaignGoalSelector';
import { useToast } from '@/hooks/use-toast';
import TemplateSelector from '@/components/templates/TemplateSelector';

type CampaignCreatorStep = 'template-selection' | 'contacts' | 'template' | 'message-content' | 'follow-ups' | 'schedule' | 'knowledge-base' | 'review' | 'goal';

interface CampaignCreatorProps {
  onComplete?: () => void;
  initialStep?: CampaignCreatorStep;
  existingCampaign?: Campaign; // For editing an existing campaign
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ 
  onComplete, 
  initialStep = 'template-selection',
  existingCampaign 
}) => {
  const { toast } = useToast();
  const { 
    contacts, 
    templates, 
    knowledgeBases,
    createCampaign,
    updateCampaign
  } = useApp();
  
  // UI state
  const [currentStep, setCurrentStep] = useState<CampaignCreatorStep>(initialStep);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>(undefined);
  
  // Campaign data state
  const [campaignName, setCampaignName] = useState(existingCampaign?.name || '');
  const [campaignDescription, setCampaignDescription] = useState(existingCampaign?.description || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(existingCampaign?.templateId);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(existingCampaign?.contactIds || []);
  const [selectedContactListId, setSelectedContactListId] = useState<string | undefined>(existingCampaign?.contactListId);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(existingCampaign?.segmentId);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string | undefined>(existingCampaign?.knowledgeBaseId);
  const [followUps, setFollowUps] = useState<FollowUp[]>(existingCampaign?.followUps || []);
  const [scheduledStartDate, setScheduledStartDate] = useState<Date | undefined>(existingCampaign?.scheduledStartDate);
  const [sendingWindow, setSendingWindow] = useState(existingCampaign?.sendingWindow);
  const [timeZone, setTimeZone] = useState(existingCampaign?.timeZone || 'America/Los_Angeles');
  const [campaignGoal, setCampaignGoal] = useState(existingCampaign?.goal);
  
  // Update contacts when contactIds change
  useEffect(() => {
    if (selectedContactIds.length > 0) {
      const contactsData = contacts.filter(contact => selectedContactIds.includes(contact.id));
      setSelectedContacts(contactsData);
    } else {
      setSelectedContacts([]);
    }
  }, [selectedContactIds, contacts]);
  
  // Get the selected template
  const selectedTemplate = templates.find(template => template.id === selectedTemplateId);
  
  // Define the steps
  const steps: { id: CampaignCreatorStep; label: string; icon: React.ReactNode }[] = [
    { id: 'template-selection', label: 'Choose Template', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'contacts', label: 'Select Contacts', icon: <Users className="h-4 w-4" /> },
    { id: 'message-content', label: 'Message', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'follow-ups', label: 'Follow-ups', icon: <ListChecks className="h-4 w-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
    { id: 'goal', label: 'Set Goal', icon: <Pencil className="h-4 w-4" /> },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'review', label: 'Review', icon: <Check className="h-4 w-4" /> }
  ];
  
  // Step completion status
  const getStepStatus = (step: CampaignCreatorStep) => {
    switch (step) {
      case 'template-selection':
        return !!selectedTemplateId;
      case 'contacts':
        return selectedContactIds.length > 0 || !!selectedContactListId || !!selectedSegmentId;
      case 'message-content':
        return !!selectedTemplateId;
      case 'follow-ups':
        return true; // Follow-ups are optional
      case 'schedule':
        return !!scheduledStartDate && !!sendingWindow;
      case 'knowledge-base':
        return true; // Knowledge base is optional
      case 'goal':
        return !!campaignGoal;
      case 'review':
        return campaignName.trim().length > 0;
      default:
        return false;
    }
  };
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };
  
  // Handle contact selection
  const handleContactSelect = (contacts: string[]) => {
    setSelectedContactIds(contacts);
  };
  
  // Handle list selection
  const handleListSelect = (listId?: string) => {
    setSelectedContactListId(listId);
  };
  
  // Handle segment selection
  const handleSegmentSelect = (segmentId?: string) => {
    setSelectedSegmentId(segmentId);
  };
  
  // Handle knowledge base selection
  const handleKnowledgeBaseSelect = (knowledgeBaseId?: string) => {
    setSelectedKnowledgeBaseId(knowledgeBaseId);
  };
  
  // Handle follow-up updates
  const handleFollowUpsUpdate = (updatedFollowUps: FollowUp[]) => {
    setFollowUps(updatedFollowUps);
  };
  
  // Handle template creation/edition completion
  const handleTemplateEditorClose = () => {
    setIsCreatingTemplate(false);
    setEditingTemplate(undefined);
  };
  
  // Handle template edit
  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(template);
    }
  };
  
  // Process campaign template selection
  const handleCampaignTemplateSelect = (template: any) => {
    // First create a new message template if needed
    const existingTemplate = templates.find(t => 
      t.name === template.name && 
      t.body === template.messageTemplateBody
    );
    
    if (existingTemplate) {
      // Use existing template
      setSelectedTemplateId(existingTemplate.id);
    } else {
      // Create a new template based on the campaign template
      const newTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
        name: template.name,
        body: template.messageTemplateBody,
        variables: template.variables
      };
      
      // Open template editor with pre-populated data
      setEditingTemplate({
        ...newTemplate,
        id: '', // Will be generated on save
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Set campaign name and description based on template
    setCampaignName(template.name);
    setCampaignDescription(template.description);
    
    // Set follow-ups if available
    if (template.followUps && template.followUps.length > 0) {
      const newFollowUps: FollowUp[] = template.followUps.map((followUp: any, index: number) => ({
        id: `follow-up-${Date.now()}-${index}`,
        templateId: selectedTemplateId || '', // Will be updated after template creation
        delayDays: followUp.delayDays,
        enabled: true,
        condition: followUp.condition
      }));
      
      setFollowUps(newFollowUps);
    }
    
    // Move to next step
    setCurrentStep('contacts');
  };
  
  // Navigation
  const goToStep = (step: CampaignCreatorStep) => {
    setCurrentStep(step);
  };
  
  const goToNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };
  
  const goToPrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };
  
  // Check if the current step is valid before proceeding
  const canProceed = () => {
    return getStepStatus(currentStep);
  };
  
  // Submit campaign
  const handleSubmit = () => {
    if (!selectedTemplateId) {
      toast({
        title: "Template Required",
        description: "Please select a template for your campaign.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedContactIds.length && !selectedContactListId && !selectedSegmentId) {
      toast({
        title: "Contacts Required",
        description: "Please select contacts, a contact list, or a segment for your campaign.",
        variant: "destructive"
      });
      return;
    }
    
    if (!campaignName.trim()) {
      toast({
        title: "Campaign Name Required",
        description: "Please provide a name for your campaign.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create campaign data
      const campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
        name: campaignName,
        description: campaignDescription,
        status: 'draft',
        templateId: selectedTemplateId,
        contactIds: selectedContactIds,
        contactListId: selectedContactListId,
        segmentId: selectedSegmentId,
        contactCount: selectedContacts.length,
        knowledgeBaseId: selectedKnowledgeBaseId,
        followUps,
        scheduledStartDate,
        sendingWindow,
        timeZone,
        goal: campaignGoal
      };
      
      if (existingCampaign) {
        // Update existing campaign
        updateCampaign(existingCampaign.id, campaignData);
        toast({
          title: "Campaign Updated",
          description: `Campaign "${campaignName}" has been updated successfully.`
        });
      } else {
        // Create new campaign
        createCampaign(campaignData);
        toast({
          title: "Campaign Created",
          description: `Campaign "${campaignName}" has been created successfully.`
        });
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'template-selection':
        return (
          <TemplateSelector onSelect={handleCampaignTemplateSelect} />
        );
      case 'contacts':
        return (
          <CampaignContactSelection
            selectedContactIds={selectedContactIds}
            selectedListId={selectedContactListId}
            selectedSegmentId={selectedSegmentId}
            onContactsSelect={handleContactSelect}
            onListSelect={handleListSelect}
            onSegmentSelect={handleSegmentSelect}
          />
        );
      case 'template':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Select a Message Template</h2>
              <Button onClick={() => setIsCreatingTemplate(true)}>Create New Template</Button>
            </div>
            
            <TemplateList
              templates={templates}
              onEdit={handleEditTemplate}
              onDelete={() => {}} // Read-only in this context
              selectedTemplateId={selectedTemplateId}
              onSelect={handleTemplateSelect}
            />
          </div>
        );
      case 'message-content':
        return selectedTemplate ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Message Content</h2>
              <Button 
                variant="outline" 
                onClick={() => handleEditTemplate(selectedTemplate.id)}
              >
                Edit Template
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{selectedTemplate.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{selectedTemplate.body}</div>
                
                {selectedTemplate.variables.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Variables in this template:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map(variable => (
                        <div key={variable} className="px-2 py-1 bg-secondary rounded text-sm">
                          {variable}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No template selected</h3>
            <p className="text-muted-foreground mt-2">Please go back and select a template first.</p>
            <Button 
              className="mt-4" 
              variant="secondary"
              onClick={() => goToStep('template')}
            >
              Select Template
            </Button>
          </div>
        );
      case 'follow-ups':
        return selectedTemplate ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Follow-up Messages</h2>
            
            <FollowUpFlowBuilder
              initialTemplateId={selectedTemplate.id}
              followUps={followUps}
              templates={templates}
              onUpdate={handleFollowUpsUpdate}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No template selected</h3>
            <p className="text-muted-foreground mt-2">Please go back and select a template first.</p>
            <Button 
              className="mt-4" 
              variant="secondary"
              onClick={() => goToStep('template')}
            >
              Select Template
            </Button>
          </div>
        );
      case 'schedule':
        return (
          <ScheduleCampaign
            scheduledStartDate={scheduledStartDate}
            sendingWindow={sendingWindow}
            timeZone={timeZone}
            onScheduleChange={(date) => setScheduledStartDate(date)}
            onSendingWindowChange={(window) => setSendingWindow(window)}
            onTimeZoneChange={(zone) => setTimeZone(zone)}
          />
        );
      case 'knowledge-base':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Add Knowledge Base</h2>
            <p className="text-muted-foreground">
              Adding a knowledge base will help in responding to customer questions 
              with accurate information from your documents.
            </p>
            
            <KnowledgeBaseList
              knowledgeBases={knowledgeBases}
              selectedKnowledgeBaseId={selectedKnowledgeBaseId}
              onSelect={handleKnowledgeBaseSelect}
            />
          </div>
        );
      case 'goal':
        return (
          <CampaignGoalSelector
            selectedGoal={campaignGoal}
            onChange={setCampaignGoal}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Campaign</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="campaign-description">Description (optional)</Label>
                <Textarea
                  id="campaign-description"
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Enter campaign description"
                  className="mt-1"
                />
              </div>
            </div>
            
            <CampaignDetailView
              campaign={{
                id: existingCampaign?.id || 'new-campaign',
                name: campaignName,
                description: campaignDescription,
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                contactCount: selectedContacts.length,
                templateId: selectedTemplateId,
                contactIds: selectedContactIds,
                contactListId: selectedContactListId,
                segmentId: selectedSegmentId,
                knowledgeBaseId: selectedKnowledgeBaseId,
                followUps,
                scheduledStartDate,
                sendingWindow,
                timeZone,
                goal: campaignGoal
              }}
              templates={templates}
              contacts={contacts}
              selectedTemplate={selectedTemplate}
              selectedContacts={selectedContacts}
              selectedKnowledgeBase={knowledgeBases.find(kb => kb.id === selectedKnowledgeBaseId)}
              isReview={true}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="hidden sm:flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div 
              className={`flex flex-col items-center cursor-pointer ${
                index <= steps.findIndex(s => s.id === currentStep) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
              onClick={() => goToStep(step.id)}
            >
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                  currentStep === step.id 
                    ? "bg-primary text-primary-foreground" 
                    : index < steps.findIndex(s => s.id === currentStep)
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {getStepStatus(step.id) && index < steps.findIndex(s => s.id === currentStep) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs font-medium text-center">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 ${
                  index < steps.findIndex(s => s.id === currentStep) 
                    ? "bg-primary" 
                    : "bg-muted"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile step indicator */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">
            Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
          </div>
          <div className="text-sm font-medium">
            {steps.find(s => s.id === currentStep)?.label}
          </div>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full"
            style={{ width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="min-h-[300px]">
        {renderStep()}
      </div>
      
      {/* Template editor modal */}
      {(isCreatingTemplate || editingTemplate) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <TemplateEditor
              template={editingTemplate}
              onClose={handleTemplateEditorClose}
            />
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={goToPrevious}
          disabled={currentStep === 'template-selection'}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentStep === 'review' ? (
          <Button 
            onClick={handleSubmit}
            disabled={!canProceed()}
          >
            <Save className="h-4 w-4 mr-2" />
            {existingCampaign ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        ) : (
          <Button 
            onClick={goToNext}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampaignCreator;
