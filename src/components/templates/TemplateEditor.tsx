
import React, { useState, useEffect } from 'react';
import { Template } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateEditorProps {
  template?: Template;
  onClose: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template,
  onClose
}) => {
  const { createTemplate } = useApp();
  const { toast } = useToast();
  
  const [name, setName] = useState(template?.name || '');
  const [body, setBody] = useState(template?.body || '');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [newVariable, setNewVariable] = useState('');
  
  // Extract variables from body
  useEffect(() => {
    const variableRegex = /\{([^}]+)\}/g;
    const matches = [...body.matchAll(variableRegex)];
    
    const extractedVariables = matches.map(match => match[1].trim());
    const uniqueVariables = [...new Set(extractedVariables)];
    
    setVariables(uniqueVariables);
  }, [body]);
  
  const handleAddVariable = () => {
    if (!newVariable.trim() || variables.includes(newVariable.trim())) {
      return;
    }
    
    setVariables([...variables, newVariable.trim()]);
    setNewVariable('');
  };
  
  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };
  
  const handleInsertVariable = (variable: string) => {
    setBody(prev => `${prev}{${variable}}`);
  };
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!body.trim()) {
      toast({
        title: "Validation Error",
        description: "Template body is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (template) {
      // If editing existing template (not implemented in this version)
      toast({
        title: "Not Implemented",
        description: "Editing templates is not available in this version.",
      });
    } else {
      // Create new template
      createTemplate({
        name,
        body,
        variables
      });
      
      // Reset form
      setName('');
      setBody('');
      setVariables([]);
      
      onClose();
    }
  };
  
  return (
    <AnimatedCard>
      <h2 className="text-xl font-medium mb-6">
        {template ? 'Edit Template' : 'Create Template'}
      </h2>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Initial Outreach"
            className="mt-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label htmlFor="body">Message Body</Label>
            <div className="text-xs text-muted-foreground">
              Use {'{variable}'} format for personalization
            </div>
          </div>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
            className="mt-1.5 h-32 resize-none"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label>Variables</Label>
            <div className="text-xs text-muted-foreground">
              These are automatically detected from your message
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {variables.length > 0 ? (
              variables.map(variable => (
                <Badge 
                  key={variable} 
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1.5 cursor-pointer"
                  onClick={() => handleInsertVariable(variable)}
                >
                  <Tag className="h-3 w-3" />
                  {variable}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVariable(variable);
                    }}
                  />
                </Badge>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No variables detected in your message
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newVariable}
              onChange={(e) => setNewVariable(e.target.value)}
              placeholder="Add new variable"
              className="flex-grow"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddVariable}
              disabled={!newVariable.trim() || variables.includes(newVariable.trim())}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="p-4 border rounded-lg bg-muted/30 text-sm">
            {body || <span className="text-muted-foreground">Your message preview will appear here</span>}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-1" />
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default TemplateEditor;
