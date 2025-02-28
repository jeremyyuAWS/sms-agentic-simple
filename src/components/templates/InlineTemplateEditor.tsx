
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts';
import { Template, TemplateCategory } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InlineTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateId: string) => void;
  knowledgeBaseId?: string;
}

const InlineTemplateEditor: React.FC<InlineTemplateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  knowledgeBaseId
}) => {
  const { toast } = useToast();
  const { createTemplate, templateCategories } = useApp();
  
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please provide a name for your template",
        variant: "destructive"
      });
      return;
    }
    
    if (!body.trim()) {
      toast({
        title: "Template body required",
        description: "Please add content to your template",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Extract variables from the template body
      const variableRegex = /\{\{([^}]+)\}\}/g;
      const matches = [...body.matchAll(variableRegex)];
      const variables = [...new Set(matches.map(match => match[1].trim()))];
      
      // Create a new template
      const newTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        body,
        variables,
        categoryIds: selectedCategoryId ? [selectedCategoryId] : [],
        tags: [],
        knowledgeBaseIds: knowledgeBaseId ? [knowledgeBaseId] : []
      };
      
      // Save the template and get the new ID
      const newTemplateId = `template-${Date.now()}`;
      createTemplate(newTemplate);
      
      toast({
        title: "Template created",
        description: "Your template has been created successfully"
      });
      
      // Return to the campaign creation flow with the new template ID
      onSave(newTemplateId);
      
      // Reset form
      setName('');
      setBody('');
      setSelectedCategoryId('');
    } catch (error) {
      toast({
        title: "Error creating template",
        description: "There was a problem creating your template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClose = () => {
    setName('');
    setBody('');
    setSelectedCategoryId('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-category">Category (Optional)</Label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Category</SelectItem>
                {templateCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="template-body">Template Content</Label>
              <div className="text-xs text-muted-foreground">
                Use {{variable_name}} for dynamic content
              </div>
            </div>
            <Textarea
              id="template-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your template content here..."
              className="min-h-[200px]"
            />
          </div>
          
          {/* Preview of variables */}
          {body && (
            <div className="space-y-2">
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const variableRegex = /\{\{([^}]+)\}\}/g;
                  const matches = [...body.matchAll(variableRegex)];
                  const variables = [...new Set(matches.map(match => match[1].trim()))];
                  
                  return variables.length > 0 ? (
                    variables.map((variable, index) => (
                      <Badge key={index} variant="secondary">
                        {variable}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No variables detected</span>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Template & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InlineTemplateEditor;
