
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TemplateList from '@/components/templates/TemplateList';
import TemplateEditor from '@/components/templates/TemplateEditor';
import NavigationButtons from '@/components/ui/navigation-buttons';
import { CampaignGoalType } from '@/lib/types';

// Mapping of goal types to template categories
const goalTemplateCategories: Record<CampaignGoalType, string> = {
  'lead-generation': 'Lead Generation',
  'sales': 'Sales Outreach',
  'event-promotion': 'Event Promotion',
  'customer-feedback': 'Feedback',
  'event-follow-up': 'Event Follow-up',
  'product-announcement': 'Product Announcements',
  'survey': 'Surveys',
  'webinar-invitation': 'Webinar',
  'newsletter': 'Newsletter',
  'other': 'Other'
};

const Templates: React.FC = () => {
  const { templates, templateCategories, createTemplate, updateTemplate, deleteTemplate } = useApp();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');

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

  // Filter templates based on category and goal
  const filteredTemplates = templates.filter(template => {
    // Apply category filter
    if (categoryFilter !== 'all' && (!template.categoryIds || !template.categoryIds.includes(categoryFilter))) {
      return false;
    }

    // In a real app, we'd have a proper relationship between templates and campaign goals
    // For demo purposes, we'll use categories as a proxy for goals
    if (goalFilter !== 'all') {
      const goalCategory = templateCategories.find(
        cat => cat.name === goalTemplateCategories[goalFilter as CampaignGoalType]
      );
      if (!goalCategory || !template.categoryIds?.includes(goalCategory.id)) {
        return false;
      }
    }

    return true;
  });

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
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Filter by Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {templateCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Filter by Campaign Goal</label>
                  <Select value={goalFilter} onValueChange={setGoalFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Goals</SelectItem>
                      {Object.entries(goalTemplateCategories).map(([goal, label]) => (
                        <SelectItem key={goal} value={goal}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TemplateList
                templates={filteredTemplates}
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
