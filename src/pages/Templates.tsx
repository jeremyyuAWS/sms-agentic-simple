
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Template, Contact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Tag, Copy, HelpCircle, Info } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Templates = () => {
  const { templates, contacts, createTemplate, deleteTemplate } = useApp();
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
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

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
  
  // Handle template deletion
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setTemplateToDelete(null);
      
      toast({
        title: "Template Deleted",
        description: `Template "${templateToDelete.name}" has been deleted.`
      });
    }
  };

  // Available fields for display
  const availableFields = getAvailableContactFields();

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div className="text-left">
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
              <Card className="overflow-hidden">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setTemplateToDelete(template)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteTemplate}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete template</p>
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
                  <div className="text-sm text-muted-foreground">
                    Used in campaigns: {/* This could be implemented if you track template usage */}
                    Not currently tracked
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePreview(template)}
                  >
                    Preview & Edit
                  </Button>
                </CardFooter>
              </Card>
            </React.Fragment>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default Templates;
