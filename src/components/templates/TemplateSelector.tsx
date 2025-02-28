
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Info, Sparkles, ArrowRightCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { Template, KnowledgeBase } from '@/lib/types';

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
  knowledgeBaseId?: string;
  knowledgeBases?: KnowledgeBase[];
}

// Mock function to generate a template based on knowledge base
// In a real app, this would use AI to analyze the knowledge base and generate a template
const generateTemplateFromKnowledgeBase = (
  knowledgeBase: KnowledgeBase, 
  existingTemplates: Template[]
): Promise<Template> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This would be an actual AI-generated template in a real application
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: `${knowledgeBase.title} Template`,
        body: `Based on ${knowledgeBase.title}, I wanted to reach out about our solution. Are you available to discuss how we might help with your needs?`,
        variables: ['firstName', 'company'],
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryIds: existingTemplates[0]?.categoryIds || []
      };
      resolve(newTemplate);
    }, 1500);
  });
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelect, 
  selectedTemplateId,
  knowledgeBaseId,
  knowledgeBases = []
}) => {
  const { templates, createTemplate, setActiveTemplate } = useApp();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const selectedKnowledgeBase = knowledgeBaseId 
    ? knowledgeBases.find(kb => kb.id === knowledgeBaseId) 
    : undefined;

  const handleSelect = (templateId: string) => {
    onSelect(templateId);
  };

  const handleCreateNewTemplate = () => {
    setActiveTemplate(null);
    // Navigate to template creation page
    // This would be replaced with actual navigation in a real app
    toast({
      title: "Template Creation",
      description: "Navigate to template creation (not implemented in this demo)"
    });
  };

  const handleGenerateSmartTemplate = async () => {
    if (!selectedKnowledgeBase) {
      toast({
        title: "No Knowledge Base Selected",
        description: "Please select a knowledge base first to generate a template",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate a template based on the knowledge base
      const newTemplate = await generateTemplateFromKnowledgeBase(selectedKnowledgeBase, templates);
      
      // Add the template to the app state
      createTemplate({
        name: newTemplate.name,
        body: newTemplate.body,
        variables: newTemplate.variables,
        categoryIds: newTemplate.categoryIds
      });
      
      // Select the new template
      onSelect(newTemplate.id);
      
      toast({
        title: "Template Generated",
        description: `Created new template based on "${selectedKnowledgeBase.title}"`,
      });
    } catch (error) {
      toast({
        title: "Error Generating Template",
        description: "Failed to generate template from knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Select your initial message template</h3>
          <p className="text-sm text-muted-foreground">
            Choose the template for your first message in this campaign. You'll be able to add follow-up templates later.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedKnowledgeBase && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateSmartTemplate}
                    disabled={isGenerating}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Smart Template"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Create a new template based on your knowledge base content
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="outline" size="sm" onClick={handleCreateNewTemplate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md flex items-start gap-2 text-sm">
        <Info className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <p className="font-medium">This is just your first message</p>
          <p className="text-muted-foreground mt-1">
            After selecting your initial message template, you can add follow-up messages in the "Follow-ups" tab.
            <span className="flex items-center mt-1 text-primary">
              <ArrowRightCircle className="h-4 w-4 mr-1" /> Go to Follow-ups tab after this step
            </span>
          </p>
        </div>
      </div>

      {selectedKnowledgeBase && (
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md flex items-start gap-2 text-sm">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">Knowledge Base Selected: {selectedKnowledgeBase.title}</p>
            <p className="text-muted-foreground mt-1">
              You can generate a template based on this knowledge base or select an existing template.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No templates available</p>
              <Button variant="outline" className="mt-4" onClick={handleCreateNewTemplate}>
                Create Your First Template
              </Button>
            </div>
          ) : (
            <RadioGroup value={selectedTemplateId} onValueChange={handleSelect}>
              <div className="space-y-4">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${
                      selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelect(template.id)}
                  >
                    <div className="flex items-start">
                      <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                      <div className="ml-3 flex-1">
                        <Label htmlFor={template.id} className="text-base font-medium cursor-pointer">
                          {template.name}
                        </Label>
                        <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                          {template.body.length > 200 
                            ? `${template.body.substring(0, 200)}...` 
                            : template.body}
                        </div>
                        {template.variables.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {template.variables.map(variable => (
                              <span 
                                key={variable} 
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {variable}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateSelector;
