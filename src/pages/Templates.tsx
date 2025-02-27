
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Tag, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Templates = () => {
  const { templates, createTemplate } = useApp();
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
        <div className="grid gap-6">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
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
                  {template.body}
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
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
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
            
            <div className="space-y-2">
              <Label htmlFor="body">Template Body</Label>
              <Textarea 
                id="body" 
                value={newTemplate.body} 
                onChange={handleBodyChange} 
                placeholder="Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
                rows={6}
                required
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
                {newTemplate.body.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`)}
              </div>
            </div>
          </div>
          
          <DialogFooter>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
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
          
          <DialogFooter>
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
