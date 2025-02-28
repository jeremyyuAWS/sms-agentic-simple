
import { useState } from 'react';
import { Campaign, TimeWindow } from '@/lib/types';
import { WorkflowState } from '../types';

export const createWorkflowActions = (
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void
) => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    active: false,
    currentStep: 'contacts',
    returnToStep: null,
  });
  
  const startWorkflow = () => {
    setWorkflowState({
      active: true,
      currentStep: 'contacts',
    });
  };
  
  const continueWorkflow = (nextStep: WorkflowState['currentStep']) => {
    setWorkflowState(prev => ({
      ...prev,
      currentStep: nextStep,
    }));
  };
  
  const updateWorkflowData = (data: Partial<WorkflowState>) => {
    setWorkflowState(prev => ({
      ...prev,
      ...data,
    }));
  };
  
  const completeWorkflow = () => {
    // Before resetting, we may want to create a campaign with the collected data
    const { contactsData, templateData, campaignData, scheduleData } = workflowState;
    
    if (contactsData && templateData && campaignData) {
      // Create a new campaign with the collected data
      const newCampaign: Omit<Campaign, 'id' | 'createdAt'> = {
        name: campaignData.name || 'New Campaign',
        description: campaignData.description,
        status: 'draft',
        updatedAt: new Date(),
        contactCount: contactsData.contactIds?.length || 0,
        templateId: templateData.selectedTemplateId,
        knowledgeBaseId: campaignData.knowledgeBaseId,
        scheduledStartDate: scheduleData?.scheduledStartDate,
        timeZone: scheduleData?.timeZone,
        sendingWindow: scheduleData?.sendingWindow,
        contactIds: contactsData.contactIds,
        contactListId: contactsData.listId,
        segmentId: contactsData.segmentId,
      };
      
      createCampaign(newCampaign);
    }
    
    // Reset the workflow state
    setWorkflowState({
      active: false,
      currentStep: 'contacts',
      returnToStep: null,
    });
  };
  
  const cancelWorkflow = () => {
    // Simply reset the workflow state
    setWorkflowState({
      active: false,
      currentStep: 'contacts',
      returnToStep: null,
    });
  };
  
  // New methods for template creation workflow
  const startTemplateCreation = (returnToStep: WorkflowState['currentStep']) => {
    setWorkflowState(prev => ({
      ...prev,
      returnToStep: returnToStep,
    }));
  };
  
  const finishTemplateCreation = (templateId?: string) => {
    setWorkflowState(prev => {
      const returnTo = prev.returnToStep || 'template';
      
      // If template was created and ID returned, update template data
      const updatedTemplateData = templateId 
        ? { ...prev.templateData, selectedTemplateId: templateId }
        : prev.templateData;
        
      return {
        ...prev,
        currentStep: returnTo,
        returnToStep: null,
        templateData: updatedTemplateData
      };
    });
  };

  return {
    workflow: workflowState,
    startWorkflow,
    continueWorkflow,
    updateWorkflowData,
    completeWorkflow,
    cancelWorkflow,
    startTemplateCreation,
    finishTemplateCreation
  };
};
