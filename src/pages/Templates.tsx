
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Template, Contact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Tag, Copy, HelpCircle, Info, Clock, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const Templates = () => {
  const { templates, contacts, createTemplate } = useApp();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    body: ''
  });
  const [extractedVariables, setExtractedVariables] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{[key: string]: string}>({});
  
  // Scheduling states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [showScheduling, setShowScheduling] = useState(false);
  const [templateSchedules, setTemplateSchedules] = useState<{[templateId: string]: {date: Date, time: string, condition?: 'no-response' | 'all'}}>({});
  const [selectedCondition, setSelectedCondition] = useState<'no-response' | 'all'>('all');

  // Get available contact fields for template variables
  const getAvailableContactFields = () => {
    // Start with standard contact fields
    const standardFields = [
      { name: 'name', description: 'Contact\'s full name' },
      { name: 'phoneNumber', description: 'Contact\'s phone number' },
      { name: 'email', description: 'Contact\'s email address' },
      { name: 'company', description: 'Company or organization name' },
      { name: 'position', description: 'Job title or position' }
    ];
    
    // Get custom fields from contacts if available
    const customFields = new Set<string>();
    contacts.forEach(contact => {
      Object.keys(contact).forEach(key => {
        // Skip standard fields and id
        if (!['id', 'name', 'phoneNumber', 'email', 'company', 'position'].includes(key)) {
          customFields.add(key);
        }
      });
    });
    
    return {
      standard: standardFields,
      custom: Array.from(customFields).map(field => ({ name: field, description: `Custom field: ${field}` }))
    };
  };

  // Function to extract variables from template body
  const extractVariables = (text: string) => {
    const variableRegex = /\{([^}]+)\}/g;
    const matches = [...text.matchAll(variableRegex)];
    const extractedVars = matches.map(match => match[1].trim());
    const uniqueVars = [...new Set(extractedVars)];
    return uniqueVars;
  };

  // Handle template body change
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setNewTemplate({
      ...newTemplate,
      body: newBody
    });
    
    // Extract variables
    const variables = extractVariables(newBody);
    setExtractedVariables(variables);
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string, textareaId: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const variableText = `{${variable}}`;
    
    const newText = text.substring(0, start) + variableText + text.substring(end);
    
    if (textareaId === 'body') {
      setNewTemplate({
        ...newTemplate,
        body: newText
      });
      
      // Extract variables including the newly added one
      const variables = extractVariables(newText);
      setExtractedVariables(variables);
    }
    
    // Set focus back to textarea for better UX
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + variableText.length;
      textarea.selectionEnd = start + variableText.length;
    }, 0);
  };

  // Handle template creation
  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!newTemplate.body.trim()) {
      toast({
        title: "Error",
        description: "Template body is required.",
        variant: "destructive"
      });
      return;
    }

    createTemplate({
      name: newTemplate.name,
      body: newTemplate.body,
      variables: extractedVariables
    });

    setNewTemplate({
      name: '',
      body: ''
    });
    setExtractedVariables([]);
    setIsCreateOpen(false);

    toast({
      title: "Success",
      description: "Template created successfully."
    });
  };

  // Handle template preview
  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    
    // Initialize preview data with empty values for all variables
    const initialData: {[key: string]: string} = {};
    template.variables.forEach(variable => {
      initialData[variable] = `[${variable}]`;
    });
    
    setPreviewData(initialData);
    setIsPreviewOpen(true);
  };

  // Update preview data for a specific variable
  const handlePreviewDataChange = (variable: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // Render preview with variables replaced
  const renderPreview = () => {
    if (!selectedTemplate) return '';
    
    let preview = selectedTemplate.body;
    Object.entries(previewData).forEach(([variable, value]) => {
      preview = preview.replace(new RegExp(`{${variable}}`, 'g'), value || `[${variable}]`);
    });
    
    return preview;
  };

  // Copy template to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Template copied to clipboard."
      });
    });
  };

  // Scheduling functionality
  const handleScheduleTemplate = (templateId: string) => {
    setSelectedTemplate(templates.find(t => t.id === templateId) || null);
    
    // Initialize with existing schedule or defaults
    if (templateSchedules[templateId]) {
      setSelectedDate(templateSchedules[templateId].date);
      setSelectedTime(templateSchedules[templateId].time);
      setSelectedCondition(templateSchedules[templateId].condition || 'all');
    } else {
      setSelectedDate(undefined);
      setSelectedTime("09:00");
      setSelectedCondition('all');
    }
    
    setShowScheduling(true);
  };

  const saveSchedule = () => {
    if (!selectedTemplate || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select a valid date and time.",
        variant: "destructive"
      });
      return;
    }

    setTemplateSchedules(prev => ({
      ...prev,
      [selectedTemplate.id]: {
        date: selectedDate,
        time: selectedTime,
        condition: selectedCondition
      }
    }));

    setShowScheduling(false);
    
    toast({
      title: "Success",
      description: `Schedule set for "${selectedTemplate.name}".`
    });
  };

  const removeSchedule = (templateId: string) => {
    setTemplateSchedules(prev => {
      const updated = { ...prev };
      delete updated[templateId];
      return updated;
    });
    
    toast({
      title: "Schedule Removed",
      description: "The scheduled sending has been canceled."
    });
  };

  // Get available fields for display
  const availableFields = getAvailableContactFields();

  // Function to generate a preview with real contact data
  const generatePreview = (templateBody: string) => {
    if (!templateBody) return "";
    
    // Check if we have contacts to use in the preview
    if (contacts.length > 0) {
      // Use the first contact for preview
      const sampleContact = contacts[0];
      let preview = templateBody;
      
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
      return templateBody.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`);
    }
  };

  // Helper function to get border color based on condition
  const getScheduleBorderClass = (templateId: string) => {
    const schedule = templateSchedules[templateId];
    if (!schedule) return "";
    
    if (schedule.condition === 'no-response') {
      return "border-red-500 border-2"; // Red for no-response
    } else {
      return "border-blue-500 border-2"; // Blue for all/regular follow-up
    }
  };

  // Helper function to get badge color based on condition
  const getConditionBadgeClass = (condition?: 'no-response' | 'all') => {
    if (condition === 'no-response') {
      return "bg-red-100 text-red-800 border-red-300"; // Red for no-response
    } else {
      return "bg-blue-100 text-blue-800 border-blue-300"; // Blue for all/regular follow-up
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Message Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable templates for your SMS campaigns with personalization variables.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full p-3 bg-primary/10 mb-4">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first message template to start building campaigns with personalized messaging.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 mb-6">
          {templates.map(template => (
            <React.Fragment key={template.id}>
              <Card className={cn("overflow-hidden", getScheduleBorderClass(template.id))}>
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyToClipboard(template.body)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy template</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePreview(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit & preview</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg text-sm mb-4">
                    {contacts.length > 0 ? (
                      <>
                        {generatePreview(template.body)}
                        <p className="text-xs text-muted-foreground mt-2">
                          Preview shows data from {contacts[0].name} ({contacts[0].company || "No company"})
                        </p>
                      </>
                    ) : (
                      template.body
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="outline" className="bg-primary/5">
                        <Tag className="h-3 w-3 mr-1" />
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <CardFooter className="bg-muted/30 p-4 border-t flex justify-between items-center">
                  {templateSchedules[template.id] ? (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Scheduled: {format(templateSchedules[template.id].date, "MMM d, yyyy")} at {templateSchedules[template.id].time}
                      </span>
                      {templateSchedules[template.id].condition && (
                        <Badge 
                          variant="outline" 
                          className={cn("ml-2", getConditionBadgeClass(templateSchedules[template.id].condition))}
                        >
                          {templateSchedules[template.id].condition === 'no-response' ? 'No Response' : 'Follow-up'}
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSchedule(template.id)}
                        className="ml-2 h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Not scheduled</div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleScheduleTemplate(template.id)}
                    className="ml-auto"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {templateSchedules[template.id] ? "Reschedule" : "Schedule Send"}
                  </Button>
                </CardFooter>
              </Card>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Color legend */}
      <div className="mb-16 p-4 bg-muted/20 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Template Color Guide</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border-2 border-blue-500"></div>
            <p className="text-sm">Blue outline: Regular follow-up (sent to all contacts)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border-2 border-red-500"></div>
            <p className="text-sm">Red outline: No-response follow-up (only sent if no reply received)</p>
          </div>
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable message template with personalization variables using {"{variable}"} syntax.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name" 
                value={newTemplate.name} 
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})} 
                placeholder="e.g., Initial Outreach"
                required
              />
            </div>
            
            {/* Available Contact Fields */}
            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <Label className="text-sm font-medium">Available Contact Fields</Label>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                Click a field to insert it into your template. Use format {"{field_name}"}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-1 text-muted-foreground">Standard Fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableFields.standard.map((field) => (
                      <TooltipProvider key={field.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs bg-background"
                              onClick={() => insertVariable(field.name, "body")}
                            >
                              <span className="truncate">{field.name}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{field.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                
                {availableFields.custom.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">Custom Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableFields.custom.map((field) => (
                        <TooltipProvider key={field.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs bg-background"
                                onClick={() => insertVariable(field.name, "body")}
                              >
                                <span className="truncate">{field.name}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{field.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Template Body</Label>
              <Textarea 
                id="body" 
                value={newTemplate.body} 
                onChange={handleBodyChange} 
                placeholder="Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
                rows={6}
                required
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{variable}"} syntax for personalization (e.g., {"{name}"}, {"{company}"})
              </p>
            </div>
            
            {extractedVariables.length > 0 && (
              <div className="space-y-2">
                <Label>Detected Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedVariables.map(variable => (
                    <Badge key={variable} variant="outline" className="bg-primary/5">
                      <Tag className="h-3 w-3 mr-1" />
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-muted/30 text-sm">
                {contacts.length > 0 ? (
                  generatePreview(newTemplate.body)
                ) : (
                  newTemplate.body.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`)
                )}
              </div>
              {contacts.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Preview shows data from {contacts[0].name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Preview how your template will look with different variable values.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <Label>Variables</Label>
                {selectedTemplate.variables.map(variable => (
                  <div key={variable} className="space-y-2">
                    <Label htmlFor={`var-${variable}`}>{variable}</Label>
                    <Input 
                      id={`var-${variable}`} 
                      value={previewData[variable] || ''} 
                      onChange={(e) => handlePreviewDataChange(variable, e.target.value)} 
                      placeholder={`Enter value for ${variable}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 border rounded-lg bg-muted/30 text-sm">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => copyToClipboard(renderPreview())}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scheduling Dialog */}
      <Dialog open={showScheduling} onOpenChange={setShowScheduling}>
        <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Schedule Template Send</DialogTitle>
            <DialogDescription>
              Set when you want to send this template to your contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Send Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sendTime">Send Time</Label>
              <Input
                id="sendTime"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sendCondition">Send Condition</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-all",
                    selectedCondition === 'all' 
                      ? "border-blue-500 bg-blue-50 text-blue-800" 
                      : "border-gray-200 hover:border-blue-200"
                  )}
                  onClick={() => setSelectedCondition('all')}
                >
                  <p className="font-medium text-sm">Follow-up</p>
                  <p className="text-xs mt-1 text-muted-foreground">Send to all contacts</p>
                </div>
                <div 
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-all",
                    selectedCondition === 'no-response' 
                      ? "border-red-500 bg-red-50 text-red-800" 
                      : "border-gray-200 hover:border-red-200"
                  )}
                  onClick={() => setSelectedCondition('no-response')}
                >
                  <p className="font-medium text-sm">No Response</p>
                  <p className="text-xs mt-1 text-muted-foreground">Only if no reply received</p>
                </div>
              </div>
            </div>
            
            {selectedTemplate && (
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label>Template Preview</Label>
                <div className="p-3 border rounded-md bg-muted/30 text-sm">
                  {contacts.length > 0 ? generatePreview(selectedTemplate.body) : selectedTemplate.body}
                </div>
                {contacts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preview shows data from {contacts[0].name}
                  </p>
                )}
                <div className="flex mt-3 gap-1 items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    selectedCondition === 'no-response' ? "bg-red-500" : "bg-blue-500"
                  )}></div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCondition === 'no-response' 
                      ? "This template will only be sent if no response is received" 
                      : "This template will be sent to all relevant contacts"}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setShowScheduling(false)}>
              Cancel
            </Button>
            <Button onClick={saveSchedule}>
              Schedule Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
