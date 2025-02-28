
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ArrowRightCircle, ChevronRight, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TemplateCategory, KnowledgeBase } from '@/lib/types';
import InlineTemplateEditor from './InlineTemplateEditor';

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
  knowledgeBaseId?: string;
  knowledgeBases?: KnowledgeBase[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplateId,
  knowledgeBaseId,
  knowledgeBases = []
}) => {
  const { templates, templateCategories, workflow, startTemplateCreation, finishTemplateCreation } = useApp();
  const [tab, setTab] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  
  const getCurrentStep = workflow.currentStep;
  
  // Filter templates based on the selected tab
  const getFilteredTemplates = () => {
    let filtered = [...templates];
    
    // We won't filter by knowledgeBaseId since the property doesn't exist in the Template type
    
    if (tab === 'all') {
      return filtered;
    } else {
      return filtered.filter(template => 
        template.categoryIds && template.categoryIds.includes(tab)
      );
    }
  };
  
  const filteredTemplates = getFilteredTemplates();
  
  const handleCreateNew = () => {
    // Mark the current step as the return point
    startTemplateCreation(getCurrentStep);
    setIsCreating(true);
  };
  
  const handleTemplateSaved = (templateId: string) => {
    setIsCreating(false);
    onSelect(templateId);
    finishTemplateCreation(templateId);
  };
  
  const handleCloseEditor = () => {
    setIsCreating(false);
    finishTemplateCreation();
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-left">Select Initial Message Template</CardTitle>
          <CardDescription className="text-left">
            Choose a template for the first message in your campaign. You can add follow-up templates later in the "Follow-ups" tab.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
            <TabsList className="mb-4 max-w-full overflow-x-auto flex-wrap">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              {templateCategories.map((category: TemplateCategory) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={tab} className="max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="border-2 border-dashed cursor-pointer hover:border-primary h-[160px] flex flex-col justify-center items-center"
                  onClick={handleCreateNew}
                >
                  <div className="text-center p-4">
                    <Plus className="h-8 w-8 mx-auto text-muted-foreground" />
                    <h3 className="mt-2 font-medium">Create New Template</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a custom template for this campaign
                    </p>
                  </div>
                </Card>
                
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer h-[160px] transition-all overflow-hidden ${
                      selectedTemplateId === template.id ? 'border-2 border-primary' : 'hover:border-primary'
                    }`}
                    onClick={() => onSelect(template.id)}
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-base truncate">{template.name}</CardTitle>
                      <div className="flex flex-wrap gap-1">
                        {template.categoryIds?.map(catId => {
                          const category = templateCategories.find(c => c.id === catId);
                          return category ? (
                            <Badge key={catId} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="max-h-[70px] pb-2 pt-0 px-4 overflow-hidden text-muted-foreground text-xs">
                      <div className="line-clamp-3 text-left">{template.body}</div>
                    </CardContent>
                    <CardFooter className="pt-0 px-4 text-sm flex justify-between">
                      <div className="text-muted-foreground text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                      {selectedTemplateId === template.id && (
                        <Badge variant="default" className="ml-auto">Selected</Badge>
                      )}
                    </CardFooter>
                  </Card>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No templates available in this category</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleCreateNew}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
          
          {selectedTemplateId && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Template selected</span>
              <ChevronRight className="h-4 w-4 ml-1" />
              <span>Continue to add follow-ups in the next step</span>
              <ArrowRightCircle className="h-4 w-4 ml-1" />
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Inline Template Editor Dialog */}
      <InlineTemplateEditor
        isOpen={isCreating}
        onClose={handleCloseEditor}
        onSave={handleTemplateSaved}
        knowledgeBaseId={knowledgeBaseId}
      />
    </div>
  );
};

export default TemplateSelector;
