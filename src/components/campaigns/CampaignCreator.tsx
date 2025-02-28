
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign, Template, KnowledgeBase, ContactFilter, FollowUp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, PlusIcon, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import TimeZoneSelector from './TimeZoneSelector';
import TimeWindowSelector from './TimeWindowSelector';
import CampaignContactSelection from './CampaignContactSelection';

interface CampaignCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define a temporary type for follow-ups without ID for form state
type FollowUpDraft = Omit<FollowUp, 'id'> & { tempId?: string };

const CampaignCreator: React.FC<CampaignCreatorProps> = ({
  open,
  onOpenChange
}) => {
  const { templates, knowledgeBases, createCampaign, contacts } = useApp();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [segmentId, setSegmentId] = useState('');
  const [customFilter, setCustomFilter] = useState<ContactFilter | undefined>();
  const [timeZone, setTimeZone] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("details");
  // Using the FollowUpDraft type for the form state
  const [followUps, setFollowUps] = useState<FollowUpDraft[]>([]);
  
  // Time window for sending
  const [sendingWindow, setSendingWindow] = useState<Campaign['sendingWindow']>({
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  });
  
  const handleCreateCampaign = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Campaign name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!templateId) {
      toast({
        title: "Error",
        description: "Message template is required",
        variant: "destructive",
      });
      return;
    }
    
    // Determine contact selection method
    let contactCount = 0;
    
    // For demo purposes, we'll use a placeholder count
    // In a real implementation, this would be calculated based on
    // selectedContactIds, segmentId, or customFilter
    if (selectedContactIds.length > 0) {
      contactCount = selectedContactIds.length;
    } else if (segmentId) {
      contactCount = 24; // Example segment size
    } else if (customFilter) {
      contactCount = 15; // Example filtered count
    } else {
      // All contacts
      contactCount = 100; // Example total count
    }

    // Create complete FollowUp objects with IDs before passing to createCampaign
    const completedFollowUps: FollowUp[] = followUps.map(followUp => ({
      ...followUp,
      id: followUp.tempId || `followup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    // Create the campaign
    createCampaign({
      name,
      description,
      status: 'draft',
      contactCount,
      updatedAt: new Date(),
      templateId,
      knowledgeBaseId: knowledgeBaseId || undefined,
      timeZone: timeZone || undefined,
      scheduledStartDate: scheduledDate,
      sendingWindow,
      followUps: completedFollowUps,
      contactIds: selectedContactIds.length > 0 ? selectedContactIds : undefined,
      segmentId: segmentId || undefined,
      customFilter
    });
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${name}" has been created successfully.`
    });
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setTemplateId('');
    setKnowledgeBaseId('');
    setSelectedContactIds([]);
    setSegmentId('');
    setCustomFilter(undefined);
    setTimeZone('');
    setScheduledDate(undefined);
    setActiveTab("details");
    setFollowUps([]);
    setSendingWindow({
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    });
  };
  
  const addFollowUp = () => {
    if (!templateId) {
      toast({
        title: "Select Template First",
        description: "Please select a primary message template before adding follow-ups.",
        variant: "destructive"
      });
      return;
    }
    
    const tempId = `temp-followup-${Date.now()}`;
    setFollowUps([
      ...followUps,
      {
        tempId, // Add temporary ID for form tracking
        templateId, // Default to same template as main message
        delayDays: 2,
        enabled: true,
        condition: 'no-response'
      }
    ]);
  };
  
  const removeFollowUp = (index: number) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };
  
  const updateFollowUp = (index: number, updates: Partial<FollowUpDraft>) => {
    setFollowUps(followUps.map((followUp, i) => {
      if (i === index) {
        return { ...followUp, ...updates };
      }
      return followUp;
    }));
  };
  
  const getTemplateNameById = (id: string) => {
    const template = templates.find(t => t.id === id);
    return template ? template.name : 'Unknown Template';
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Configure your campaign details, message template, and sending schedule.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Campaign Details</TabsTrigger>
            <TabsTrigger value="audience">Target Audience</TabsTrigger>
            <TabsTrigger value="schedule">Schedule & Follow-ups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Summer Conference Outreach"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Campaign targeting attendees of the summer tech conference"
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {templates.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No templates available. Create a template first.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="knowledgeBase">Knowledge Base (Optional)</Label>
              <Select value={knowledgeBaseId} onValueChange={setKnowledgeBaseId}>
                <SelectTrigger id="knowledgeBase">
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
            
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("audience")}>
                Continue to Audience
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <CampaignContactSelection
              contacts={contacts}
              selectedContactIds={selectedContactIds}
              onSelectionChange={setSelectedContactIds}
              segmentId={segmentId}
              onSegmentChange={setSegmentId}
              customFilter={customFilter}
              onFilterChange={setCustomFilter}
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("schedule")}>
                Continue to Schedule
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Sending Schedule</Label>
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Select a start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <TimeZoneSelector 
                value={timeZone} 
                onChange={setTimeZone} 
              />
              
              <TimeWindowSelector
                value={sendingWindow}
                onChange={setSendingWindow}
              />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Follow-up Messages</Label>
                  <Button variant="outline" size="sm" onClick={addFollowUp}>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Follow-up
                  </Button>
                </div>
                
                {followUps.length === 0 ? (
                  <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                    No follow-ups added. Add a follow-up message to increase response rates.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {followUps.map((followUp, index) => (
                      <div key={followUp.tempId || index} className="border rounded-md p-3 bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            Follow-up #{index + 1}: {getTemplateNameById(followUp.templateId)}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFollowUp(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`followup-delay-${index}`} className="text-xs">
                              Send after (days)
                            </Label>
                            <Input
                              id={`followup-delay-${index}`}
                              type="number"
                              min="1"
                              value={followUp.delayDays}
                              onChange={(e) => updateFollowUp(index, { 
                                delayDays: parseInt(e.target.value) || 1 
                              })}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`followup-condition-${index}`} className="text-xs">
                              Condition
                            </Label>
                            <Select
                              value={followUp.condition || 'no-response'}
                              onValueChange={(value: 'no-response' | 'all') => updateFollowUp(index, { condition: value })}
                            >
                              <SelectTrigger id={`followup-condition-${index}`}>
                                <SelectValue placeholder="When to send" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no-response">Only if no response</SelectItem>
                                <SelectItem value="all">Send to all</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`followup-template-${index}`} className="text-xs">
                              Template
                            </Label>
                            <Select
                              value={followUp.templateId}
                              onValueChange={(value) => updateFollowUp(index, { templateId: value })}
                            >
                              <SelectTrigger id={`followup-template-${index}`}>
                                <SelectValue placeholder="Select template" />
                              </SelectTrigger>
                              <SelectContent>
                                {templates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center pt-6">
                            <Select
                              value={followUp.enabled ? "enabled" : "disabled"}
                              onValueChange={(value) => updateFollowUp(index, { 
                                enabled: value === "enabled" 
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enabled">Enabled</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("audience")}>
                Back
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignCreator;
