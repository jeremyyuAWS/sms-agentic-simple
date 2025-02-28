
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TimeZoneSelector from './TimeZoneSelector';
import TimeWindowSelector from './TimeWindowSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Campaign, TimeZoneOption, TimeWindowOption, FollowUp, Template, Contact } from '@/lib/types';
import { CalendarIcon, PlusCircle, Clock, Trash2, CalendarPlus, CheckCircle2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";

interface CampaignCreatorProps {
  onClose: () => void;
  isOpen: boolean;
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({
  onClose,
  isOpen
}) => {
  const { templates, createCampaign, knowledgeBases, contacts } = useApp();
  const { toast } = useToast();
  
  const [campaignData, setCampaignData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    status: 'draft',
    contactCount: 0,
    templateId: '',
    timeZone: 'America/New_York',
    sendingWindow: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    },
    followUps: []
  });
  
  const [selectedTimeZone, setSelectedTimeZone] = useState<TimeZoneOption | null>(null);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<TimeWindowOption | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState<string>("09:00");
  const [showScheduleSelector, setShowScheduleSelector] = useState<boolean>(false);
  const [showFollowUpCreator, setShowFollowUpCreator] = useState<boolean>(false);
  const [currentFollowUp, setCurrentFollowUp] = useState<Partial<FollowUp>>({
    templateId: '',
    delayDays: 3,
    enabled: true,
    condition: 'no-response'
  });
  const [previewTemplate, setPreviewTemplate] = useState<string>("");

  // Reset the form when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setCampaignData({
        name: '',
        description: '',
        status: 'draft',
        contactCount: 0,
        templateId: templates.length > 0 ? templates[0].id : '',
        timeZone: 'America/New_York',
        sendingWindow: {
          startTime: '09:00',
          endTime: '17:00',
          daysOfWeek: [1, 2, 3, 4, 5]
        },
        followUps: []
      });
      setSelectedTimeZone(null);
      setSelectedTimeWindow(null);
      setScheduleDate(undefined);
      setScheduleTime("09:00");
      setShowScheduleSelector(false);
      setCurrentFollowUp({
        templateId: templates.length > 0 ? templates[0].id : '',
        delayDays: 3,
        enabled: true,
        condition: 'no-response'
      });
      
      // Initialize preview template if templates exist
      if (templates.length > 0) {
        setPreviewTemplate(templates[0].body);
      }
    }
  }, [isOpen, templates]);
  
  // Update preview template when selected template changes
  useEffect(() => {
    if (campaignData.templateId) {
      const selectedTemplate = templates.find(t => t.id === campaignData.templateId);
      if (selectedTemplate) {
        setPreviewTemplate(selectedTemplate.body);
      }
    }
  }, [campaignData.templateId, templates]);
  
  const handleTimeZoneChange = (value: string) => {
    // Find the selected time zone from the TimeZoneSelector's internal list
    // Here we just set the value directly to the campaign data
    setCampaignData(prev => ({
      ...prev,
      timeZone: value
    }));
  };
  
  const handleTimeWindowChange = (timeWindow: TimeWindowOption) => {
    setSelectedTimeWindow(timeWindow);
    setCampaignData(prev => ({
      ...prev,
      sendingWindow: {
        startTime: timeWindow.startTime,
        endTime: timeWindow.endTime,
        daysOfWeek: timeWindow.daysOfWeek
      }
    }));
  };
  
  const addFollowUp = () => {
    if (!currentFollowUp.templateId) {
      toast({
        title: "Error",
        description: "Please select a template for the follow-up message.",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentFollowUp.delayDays || currentFollowUp.delayDays < 1) {
      toast({
        title: "Error",
        description: "Please specify a valid delay in days (minimum 1 day).",
        variant: "destructive"
      });
      return;
    }
    
    // Add the follow-up to the campaign
    setCampaignData(prev => {
      const followUps = prev.followUps || [];
      return {
        ...prev,
        followUps: [
          ...followUps,
          {
            id: `temp-followup-${Date.now()}`,
            templateId: currentFollowUp.templateId!,
            delayDays: currentFollowUp.delayDays!,
            enabled: currentFollowUp.enabled ?? true,
            condition: currentFollowUp.condition || 'no-response'
          }
        ]
      };
    });
    
    // Reset the follow-up form
    setCurrentFollowUp({
      templateId: templates.length > 0 ? templates[0].id : '',
      delayDays: 3,
      enabled: true,
      condition: 'no-response'
    });
    
    setShowFollowUpCreator(false);
    
    toast({
      title: "Follow-up Added",
      description: "Follow-up message has been added to the campaign."
    });
  };
  
  const removeFollowUp = (index: number) => {
    setCampaignData(prev => {
      const followUps = prev.followUps ? [...prev.followUps] : [];
      followUps.splice(index, 1);
      return {
        ...prev,
        followUps
      };
    });
    
    toast({
      title: "Follow-up Removed",
      description: "Follow-up message has been removed from the campaign."
    });
  };
  
  const setScheduledStartDate = () => {
    if (!scheduleDate) {
      toast({
        title: "Error",
        description: "Please select a date for the campaign to start.",
        variant: "destructive"
      });
      return;
    }
    
    // Combine the date and time
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const scheduledDateTime = new Date(scheduleDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    // Make sure it's in the future
    const now = new Date();
    if (scheduledDateTime <= now) {
      toast({
        title: "Error",
        description: "The scheduled start time must be in the future.",
        variant: "destructive"
      });
      return;
    }
    
    setCampaignData(prev => ({
      ...prev,
      scheduledStartDate: scheduledDateTime
    }));
    
    setShowScheduleSelector(false);
    
    toast({
      title: "Schedule Set",
      description: `Campaign scheduled to start on ${format(scheduledDateTime, 'PPp')}.`
    });
  };
  
  const clearSchedule = () => {
    setCampaignData(prev => {
      const { scheduledStartDate, ...rest } = prev;
      return rest;
    });
    
    setScheduleDate(undefined);
    setScheduleTime("09:00");
    
    toast({
      title: "Schedule Cleared",
      description: "Campaign will start immediately when activated."
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignData.name) {
      toast({
        title: "Error",
        description: "Campaign name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!campaignData.templateId) {
      toast({
        title: "Error",
        description: "Please select a template for the campaign.",
        variant: "destructive"
      });
      return;
    }
    
    createCampaign(campaignData as Omit<Campaign, 'id' | 'createdAt'>);
    onClose();
  };
  
  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown template';
  };
  
  // Function to generate a preview with real contact data if available
  const generatePreview = () => {
    if (!previewTemplate) return "";
    
    // Check if we have contacts to use in the preview
    if (contacts.length > 0) {
      // Use the first contact for preview
      const sampleContact = contacts[0];
      let preview = previewTemplate;
      
      // Replace all variables with contact data
      Object.keys(sampleContact).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        const value = sampleContact[key] || `[${key}]`;
        preview = preview.replace(regex, String(value));
      });
      
      // Find any remaining variables that weren't replaced
      const remainingVariables = [...preview.matchAll(/{([^}]+)}/g)];
      
      if (remainingVariables.length > 0) {
        // Replace remaining variables with placeholders
        remainingVariables.forEach(match => {
          const variable = match[1];
          preview = preview.replace(new RegExp(`{${variable}}`, 'g'), `[${variable}]`);
        });
      }
      
      return preview;
    } else {
      // No contacts available, just show placeholder variables
      return previewTemplate.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`);
    }
  };
  
  // Get all available variables from the selected template
  const getTemplateVariables = () => {
    if (!campaignData.templateId) return [];
    
    const selectedTemplate = templates.find(t => t.id === campaignData.templateId);
    if (!selectedTemplate) return [];
    
    return selectedTemplate.variables;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new messaging campaign with a template, sending schedule, and follow-up messages.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                value={campaignData.name || ''} 
                onChange={(e) => setCampaignData({...campaignData, name: e.target.value})} 
                placeholder="Q3 Sales Outreach"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={campaignData.description || ''} 
                onChange={(e) => setCampaignData({...campaignData, description: e.target.value})} 
                placeholder="Campaign targeting Q3 sales prospects"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              <Select 
                value={campaignData.templateId} 
                onValueChange={(value) => setCampaignData({...campaignData, templateId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No templates available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {templates.length === 0 && (
                <p className="text-sm text-destructive mt-1">
                  Please create a template first.
                </p>
              )}
            </div>
            
            {/* Template preview with real contact data */}
            {campaignData.templateId && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Message Preview</Label>
                  <div className="flex flex-wrap gap-2">
                    {getTemplateVariables().map(variable => (
                      <Badge key={variable} variant="outline" className="bg-primary/5">
                        <Tag className="h-3 w-3 mr-1" />
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-3 border rounded-md bg-muted/30 text-sm">
                  {generatePreview()}
                </div>
                {contacts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preview shows actual data from {contacts[0].name} ({contacts[0].company || "No company"})
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="knowledgeBase">Knowledge Base (Optional)</Label>
              <Select 
                value={campaignData.knowledgeBaseId || ''} 
                onValueChange={(value) => setCampaignData({...campaignData, knowledgeBaseId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a knowledge base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {knowledgeBases.map((kb) => (
                    <SelectItem key={kb.id} value={kb.id}>
                      {kb.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Campaign Schedule</Label>
              
              {campaignData.scheduledStartDate ? (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Scheduled to start: {format(campaignData.scheduledStartDate, 'PPp')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Campaign will activate automatically at this time
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowScheduleSelector(true)}
                    >
                      Edit
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={clearSchedule}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center p-3 border rounded-md bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">No scheduled start time</p>
                    <p className="text-xs text-muted-foreground">
                      Campaign will start immediately when activated
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowScheduleSelector(true)}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              )}
              
              {/* Schedule Selector Dialog */}
              <Dialog open={showScheduleSelector} onOpenChange={setShowScheduleSelector}>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Campaign Start</DialogTitle>
                    <DialogDescription>
                      Set when you want this campaign to start sending messages.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scheduleTime">Start Time</Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowScheduleSelector(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={setScheduledStartDate}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Set Schedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Time Zone & Sending Window</Label>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <TimeZoneSelector 
                    value={campaignData.timeZone || "America/New_York"} 
                    onChange={handleTimeZoneChange} 
                    className="w-full"
                  />
                </div>
                <div>
                  <TimeWindowSelector 
                    value={campaignData.sendingWindow || {
                      startTime: '09:00',
                      endTime: '17:00',
                      daysOfWeek: [1, 2, 3, 4, 5]
                    }} 
                    onChange={handleTimeWindowChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-base">Follow-up Messages</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFollowUpCreator(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Follow-up
                </Button>
                
                {/* Follow-up Creator Dialog */}
                <Dialog open={showFollowUpCreator} onOpenChange={setShowFollowUpCreator}>
                  <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                      <DialogTitle>Add Follow-up Message</DialogTitle>
                      <DialogDescription>
                        Create an automated follow-up message to send after your initial outreach.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="followUpTemplate">Message Template</Label>
                        <Select 
                          value={currentFollowUp.templateId} 
                          onValueChange={(value) => setCurrentFollowUp({...currentFollowUp, templateId: value})}
                        >
                          <SelectTrigger id="followUpTemplate">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.length > 0 ? (
                              templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No templates available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="delayDays">Send After (Days)</Label>
                        <Input
                          id="delayDays"
                          type="number"
                          min="1"
                          max="30"
                          value={currentFollowUp.delayDays}
                          onChange={(e) => setCurrentFollowUp({
                            ...currentFollowUp, 
                            delayDays: parseInt(e.target.value)
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of days to wait after the initial message before sending this follow-up
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="condition">Send Condition</Label>
                        <Select 
                          value={currentFollowUp.condition} 
                          onValueChange={(value: 'no-response' | 'all') => setCurrentFollowUp({
                            ...currentFollowUp, 
                            condition: value
                          })}
                        >
                          <SelectTrigger id="condition">
                            <SelectValue placeholder="Select when to send" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-response">Only if no response received</SelectItem>
                            <SelectItem value="all">Send to all contacts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enabled"
                          checked={currentFollowUp.enabled}
                          onCheckedChange={(checked) => setCurrentFollowUp({
                            ...currentFollowUp, 
                            enabled: checked
                          })}
                        />
                        <Label htmlFor="enabled">Enabled</Label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowFollowUpCreator(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addFollowUp}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Add Follow-up
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {campaignData.followUps && campaignData.followUps.length > 0 ? (
                <div className="space-y-3">
                  {campaignData.followUps.map((followUp, index) => (
                    <div 
                      key={followUp.id} 
                      className={cn(
                        "p-3 border rounded-md flex justify-between items-center",
                        followUp.enabled ? "bg-muted/30" : "bg-muted/10 opacity-70"
                      )}
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{getTemplateName(followUp.templateId)}</p>
                        <div className="flex gap-4">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {followUp.delayDays} days after initial message
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {followUp.condition === 'no-response' ? 'Only if no response' : 'All contacts'}
                          </p>
                          {!followUp.enabled && (
                            <Badge variant="outline" className="text-xs bg-muted">Disabled</Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFollowUp(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    No follow-up messages configured. Follow-ups can improve response rates.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignCreator;
