
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Campaign, Template, KnowledgeBase, ContactFilter, FollowUp, ContactList } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, PlusIcon, Trash2, X, Check, Clock, AlertCircle, Users, List, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import TimeZoneSelector from './TimeZoneSelector';
import TimeWindowSelector from './TimeWindowSelector';
import CampaignContactSelection from './CampaignContactSelection';

// Define props for the component
interface CampaignCreatorProps {
  campaign?: Campaign;
  contacts: any[];
  contactLists: ContactList[];
  templates: Template[];
  knowledgeBases: KnowledgeBase[];
  onCreateCampaign: (campaignData: any) => void;
  onUpdateCampaign: (campaignId: string, campaignData: any) => void;
  onCancel: () => void;
}

// Define a temporary type for follow-ups without ID for form state
type FollowUpDraft = Omit<FollowUp, 'id'> & { tempId?: string };

const CampaignCreator: React.FC<CampaignCreatorProps> = ({
  campaign,
  contacts,
  contactLists,
  templates,
  knowledgeBases,
  onCreateCampaign,
  onUpdateCampaign,
  onCancel
}) => {
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [templateId, setTemplateId] = useState(campaign?.templateId || '');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState(campaign?.knowledgeBaseId || '');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(campaign?.contactIds || []);
  const [contactListId, setContactListId] = useState(campaign?.contactListId || '');
  const [segmentId, setSegmentId] = useState(campaign?.segmentId || '');
  const [customFilter, setCustomFilter] = useState<ContactFilter | undefined>(campaign?.customFilter);
  const [timeZone, setTimeZone] = useState(campaign?.timeZone || '');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    campaign?.scheduledStartDate ? new Date(campaign.scheduledStartDate) : undefined
  );
  const [activeTab, setActiveTab] = useState("details");
  
  // Using the FollowUpDraft type for the form state
  const [followUps, setFollowUps] = useState<FollowUpDraft[]>(
    campaign?.followUps?.map(fu => ({ ...fu, tempId: `temp-${fu.id}` })) || []
  );
  
  // Selected template (for display purposes)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Selected contact list (for display purposes)
  const [selectedContactList, setSelectedContactList] = useState<ContactList | null>(null);
  
  // Time window for sending
  const [sendingWindow, setSendingWindow] = useState<Campaign['sendingWindow']>(
    campaign?.sendingWindow || {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
    }
  );
  
  // Validation states
  const [errors, setErrors] = useState({
    name: false,
    templateId: false,
    contacts: false
  });
  
  // Update selected template when templateId changes
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [templateId, templates]);
  
  // Update selected contact list when contactListId changes
  useEffect(() => {
    if (contactListId) {
      const contactList = contactLists.find(cl => cl.id === contactListId);
      setSelectedContactList(contactList || null);
      
      // If a contact list is selected, set the contact IDs to that list's contacts
      if (contactList) {
        setSelectedContactIds(contactList.contactIds);
      }
    } else {
      setSelectedContactList(null);
    }
  }, [contactListId, contactLists]);
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      templateId: !templateId,
      contacts: !hasContactSelection()
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  // Check if any contact selection method is used
  const hasContactSelection = () => {
    return (selectedContactIds.length > 0 || contactListId || segmentId || customFilter);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate contact count
    let contactCount = 0;
    
    if (selectedContactIds.length > 0) {
      contactCount = selectedContactIds.length;
    } else if (contactListId) {
      const list = contactLists.find(cl => cl.id === contactListId);
      contactCount = list?.contactIds.length || 0;
    } else if (segmentId) {
      // Example segment size (in a real app, this would be calculated)
      contactCount = 24;
    } else if (customFilter) {
      // Example filtered count (in a real app, this would be calculated)
      contactCount = 15;
    }

    // Create complete FollowUp objects with IDs
    const completedFollowUps: FollowUp[] = followUps.map(followUp => ({
      ...followUp,
      id: followUp.id || `followup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    // Prepare campaign data
    const campaignData = {
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
      contactListId: contactListId || undefined,
      segmentId: segmentId || undefined,
      customFilter
    };
    
    // Create or update the campaign
    if (campaign) {
      onUpdateCampaign(campaign.id, campaignData);
    } else {
      onCreateCampaign(campaignData);
    }
  };
  
  // Handle adding a follow-up
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
  
  // Handle removing a follow-up
  const removeFollowUp = (index: number) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };
  
  // Handle updating a follow-up
  const updateFollowUp = (index: number, updates: Partial<FollowUpDraft>) => {
    setFollowUps(followUps.map((followUp, i) => {
      if (i === index) {
        return { ...followUp, ...updates };
      }
      return followUp;
    }));
  };
  
  // Get the name of a template by ID
  const getTemplateNameById = (id: string) => {
    const template = templates.find(t => t.id === id);
    return template ? template.name : 'Unknown Template';
  };
  
  // Handle contact selection changes
  const handleContactSelectionChange = (contactIds: string[]) => {
    setSelectedContactIds(contactIds);
    // If user manually selects contacts, clear the contact list selection
    if (contactIds.length > 0) {
      setContactListId('');
    }
  };
  
  // Handle contact list selection
  const handleContactListChange = (listId: string) => {
    setContactListId(listId);
    
    // If a list is selected, use its contacts
    if (listId) {
      const list = contactLists.find(cl => cl.id === listId);
      if (list) {
        setSelectedContactIds(list.contactIds);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</CardTitle>
          <CardDescription>
            {campaign 
              ? 'Update your campaign settings, audience, and schedule' 
              : 'Set up a new outreach campaign to connect with your contacts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Campaign Details</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Target Audience</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Schedule & Follow-ups</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
                    Campaign Name*
                  </Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Summer Conference Outreach"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">Campaign name is required</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Campaign targeting attendees of the summer tech conference"
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template" className={errors.templateId ? 'text-destructive' : ''}>
                    Message Template*
                  </Label>
                  
                  {/* Template selection with card display */}
                  <div className="space-y-2">
                    <Select value={templateId} onValueChange={setTemplateId}>
                      <SelectTrigger id="template" className={cn(
                        errors.templateId ? 'border-destructive' : '',
                        "w-full"
                      )}>
                        <SelectValue placeholder="Select a message template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">
                            No templates available
                          </div>
                        ) : (
                          templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    
                    {errors.templateId && (
                      <p className="text-sm text-destructive">A message template is required</p>
                    )}
                    
                    {/* Preview selected template */}
                    {selectedTemplate && (
                      <Card className="border-primary/20 bg-primary/5 mt-4">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Selected Template: {selectedTemplate.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4 border-t">
                          <div className="text-sm text-muted-foreground line-clamp-3">
                            {selectedTemplate.body}
                          </div>
                          
                          {selectedTemplate.variables.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedTemplate.variables.map(variable => (
                                <Badge key={variable} variant="outline" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    
                    {templates.length === 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-amber-800 font-medium">No templates available</p>
                            <p className="text-amber-700 text-sm mt-1">
                              Create templates first before starting a campaign.
                            </p>
                            <Button 
                              variant="outline" 
                              className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100" 
                              size="sm"
                              onClick={() => window.location.href = '/templates'}
                            >
                              Go to Templates
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                  <p className="text-xs text-muted-foreground">
                    Knowledge bases provide context for AI-generated messages and responses.
                  </p>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => setActiveTab("audience")}
                    className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
                  >
                    Continue to Audience
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="audience" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactList" className={errors.contacts ? 'text-destructive' : ''}>
                    Select Contact List
                  </Label>
                  
                  <Select value={contactListId} onValueChange={handleContactListChange}>
                    <SelectTrigger id="contactList" className={cn(
                      errors.contacts && !hasContactSelection() ? 'border-destructive' : '',
                      "w-full"
                    )}>
                      <SelectValue placeholder="Choose a contact list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Select individual contacts)</SelectItem>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.contactIds.length} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Preview selected contact list */}
                  {selectedContactList && (
                    <Card className="border-primary/20 bg-primary/5 mt-4">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          Selected List: {selectedContactList.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedContactList.contactIds.length} contacts
                        </CardDescription>
                      </CardHeader>
                      {selectedContactList.description && (
                        <CardContent className="py-3 px-4 border-t text-sm text-muted-foreground">
                          {selectedContactList.description}
                        </CardContent>
                      )}
                    </Card>
                  )}
                  
                  {contactLists.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-amber-800 font-medium">No contact lists available</p>
                          <p className="text-amber-700 text-sm mt-1">
                            Create a contact list first or select individual contacts below.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100" 
                            size="sm"
                            onClick={() => window.location.href = '/contacts'}
                          >
                            Go to Contacts
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <Label className={errors.contacts ? 'text-destructive' : ''}>
                    Or Select Individual Contacts
                  </Label>
                  
                  <CampaignContactSelection
                    contacts={contacts}
                    selectedContactIds={selectedContactIds}
                    onSelectionChange={handleContactSelectionChange}
                    segmentId={segmentId}
                    onSegmentChange={setSegmentId}
                    customFilter={customFilter}
                    onFilterChange={setCustomFilter}
                  />
                  
                  {errors.contacts && !hasContactSelection() && (
                    <p className="text-sm text-destructive mt-2">
                      Please select contacts or a contact list for your campaign
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setActiveTab("details")}>
                    Back to Details
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("schedule")}
                    className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
                  >
                    Continue to Schedule
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Sending Schedule</Label>
                  <div className="mt-2 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Start Date (Optional)</p>
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
                      <p className="text-xs text-muted-foreground">
                        If no date is selected, the campaign will start when manually activated.
                      </p>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addFollowUp}
                      className="flex items-center gap-1"
                    >
                      <PlusIcon className="h-4 w-4" />
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
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("audience")}>
                  Back to Audience
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
                >
                  {campaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
          >
            {campaign ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CampaignCreator;
