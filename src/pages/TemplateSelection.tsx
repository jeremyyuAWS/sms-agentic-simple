
import React, { useState } from 'react';
import { useApp } from '@/contexts/app/AppContext';
import { WorkflowProgress } from '@/components/workflow/WorkflowProgress';
import { WorkflowGuidance } from '@/components/workflow/WorkflowGuidance';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Template } from '@/lib/types';
import { PlusCircle, Check } from 'lucide-react';

const TemplateSelection: React.FC = () => {
  const { templates, workflow, updateWorkflowData } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(
    workflow.templateData?.selectedTemplateId
  );
  
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplateId(template.id);
    updateWorkflowData({
      templateData: {
        selectedTemplateId: template.id
      }
    });
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <WorkflowProgress />
      <WorkflowGuidance />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Choose a Template</h2>
        <p className="text-muted-foreground">
          Select a template to use for your campaign. The template will be used to send messages to your contacts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer hover:border-primary/50 transition-all ${
              selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{template.name}</span>
                {selectedTemplateId === template.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {template.body}
              </p>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {template.usageStats?.usageCount || 0} uses
                </span>
                <Button size="sm" variant="ghost">Preview</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {/* New template card */}
        <Card className="cursor-pointer hover:border-primary/50 transition-all flex flex-col justify-center items-center p-6">
          <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Create New Template</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create a custom template for this campaign
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TemplateSelection;
