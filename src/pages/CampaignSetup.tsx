
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app/AppContext';
import { WorkflowProgress } from '@/components/workflow/WorkflowProgress';
import { WorkflowGuidance } from '@/components/workflow/WorkflowGuidance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CampaignSetup: React.FC = () => {
  const { knowledgeBases, contacts, templates, workflow, updateWorkflowData } = useApp();
  
  const [campaignName, setCampaignName] = useState<string>(workflow.campaignData?.name || '');
  const [description, setDescription] = useState<string>(workflow.campaignData?.description || '');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | undefined>(
    workflow.campaignData?.knowledgeBaseId
  );
  
  // Get details for display
  const selectedContactCount = workflow.contactsData?.contactIds?.length || 0;
  const selectedTemplate = workflow.templateData?.selectedTemplateId
    ? templates.find(t => t.id === workflow.templateData?.selectedTemplateId)
    : null;
  
  // Update workflow data when form fields change
  useEffect(() => {
    updateWorkflowData({
      campaignData: {
        name: campaignName,
        description,
        knowledgeBaseId
      }
    });
  }, [campaignName, description, knowledgeBaseId]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <WorkflowProgress />
      <WorkflowGuidance />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main campaign setup form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  placeholder="What is this campaign for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledge-base">Knowledge Base (Optional)</Label>
                <Select 
                  value={knowledgeBaseId} 
                  onValueChange={setKnowledgeBaseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {knowledgeBases.map(kb => (
                      <SelectItem key={kb.id} value={kb.id}>
                        {kb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Knowledge bases help the AI respond to messages more effectively
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar with summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Contacts</h4>
                <p className="text-lg font-medium">{selectedContactCount} contacts selected</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Template</h4>
                <p className="text-lg font-medium">{selectedTemplate?.name || "None selected"}</p>
              </div>
              
              {knowledgeBaseId && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Knowledge Base</h4>
                  <p className="text-lg font-medium">
                    {knowledgeBases.find(kb => kb.id === knowledgeBaseId)?.name || "None"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignSetup;
