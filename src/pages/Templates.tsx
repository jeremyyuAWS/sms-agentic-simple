
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateList from '@/components/templates/TemplateList';
import TemplateEditor from '@/components/templates/TemplateEditor';
import NavigationButtons from '@/components/ui/navigation-buttons';

const Templates: React.FC = () => {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useApp();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setActiveTab('create');
  };

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplate(templateId);
    setActiveTab('create');
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setActiveTab('list');
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate, templateData);
    } else {
      createTemplate(templateData);
    }
    setActiveTab('list');
    setEditingTemplate(null);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage templates for your outreach campaigns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'create')}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">All Templates</TabsTrigger>
            <TabsTrigger value="create">
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </TabsTrigger>
          </TabsList>

          {activeTab === 'list' && (
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          )}
        </div>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Your Templates</CardTitle>
              <CardDescription>
                Message templates help you create consistent communications for different purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateList
                templates={templates}
                onEdit={handleEditTemplate}
                onDelete={deleteTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <TemplateEditor
            template={editingTemplate ? templates.find(t => t.id === editingTemplate) : undefined}
            onClose={handleCancel}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <NavigationButtons currentPage="templates" />
    </div>
  );
};

export default Templates;
