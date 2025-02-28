
import React, { useState, useEffect } from 'react';
import { Template } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Tag, ChevronDown, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TemplateEditorProps {
  template?: Template;
  onClose: () => void;
}

// Common contact fields that can be used as variables
const CONTACT_FIELDS = [
  { name: 'name', description: 'Contact\'s full name' },
  { name: 'firstName', description: 'Contact\'s first name' },
  { name: 'lastName', description: 'Contact\'s last name' },
  { name: 'email', description: 'Contact\'s email address' },
  { name: 'phone', description: 'Contact\'s phone number' },
  { name: 'company', description: 'Contact\'s company name' },
  { name: 'position', description: 'Contact\'s job title/position' },
  { name: 'city', description: 'Contact\'s city' },
  { name: 'country', description: 'Contact\'s country' },
  { name: 'industry', description: 'Contact\'s industry' },
];

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template,
  onClose
}) => {
  const { createTemplate, updateTemplate, templateCategories } = useApp();
  const { toast } = useToast();
  
  const [name, setName] = useState(template?.name || '');
  const [body, setBody] = useState(template?.body || '');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [newVariable, setNewVariable] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(template?.categoryIds || []);
  
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
    // Get cursor position or end of text
    const textarea = document.getElementById('body') as HTMLTextAreaElement;
    const startPos = textarea?.selectionStart || body.length;
    const endPos = textarea?.selectionEnd || body.length;
    
    // Insert variable at cursor position
    const newBody = body.substring(0, startPos) + `{${variable}}` + body.substring(endPos);
    setBody(newBody);
    
    // Focus back on textarea and place cursor after inserted variable
    setTimeout(() => {
      textarea?.focus();
      const newCursorPos = startPos + variable.length + 2; // +2 for the {} brackets
      textarea?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
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
    
    const templateData = {
      name,
      body,
      variables,
      categoryIds: selectedCategories
    };
    
    if (template) {
      // Update existing template
      updateTemplate(template.id, templateData);
      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully.",
      });
    } else {
      // Create new template
      createTemplate(templateData);
      toast({
        title: "Template Created",
        description: "Your new template has been created successfully.",
      });
    }
    
    // Reset form
    setName('');
    setBody('');
    setVariables([]);
    setSelectedCategories([]);
    
    onClose();
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
          <Label htmlFor="categories">Categories</Label>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {selectedCategories.length > 0 ? (
              selectedCategories.map(categoryId => {
                const category = templateCategories.find(c => c.id === categoryId);
                return (
                  <Badge 
                    key={categoryId}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1.5"
                    style={{ backgroundColor: category?.color || '#e2e8f0' }}
                  >
                    <Tag className="h-3 w-3" />
                    {category?.name || 'Unknown'}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleToggleCategory(categoryId)}
                    />
                  </Badge>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">
                No categories selected
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {templateCategories.length > 0 ? (
                  templateCategories.map(category => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => handleToggleCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                      {selectedCategories.includes(category.id) && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No categories available
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            placeholder="Hi {firstName}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
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
          
          <div className="mt-2">
            <Label className="text-sm text-muted-foreground mb-1 block">
              Suggested Contact Fields
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CONTACT_FIELDS.map(field => (
                <TooltipProvider key={field.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8 w-full justify-start"
                        onClick={() => handleInsertVariable(field.name)}
                      >
                        {field.name}
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
        </div>
        
        <div className="pt-2">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium">Preview</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is how your message will appear with placeholder variables</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30 text-sm mt-1">
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
