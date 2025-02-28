
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FollowUp, Template, KnowledgeBase, FollowUpCondition } from '@/lib/types';
import { Plus, ArrowDownCircle, MessageSquare, Clock, CheckCircle, ArrowRight, MoreHorizontal, X, GitBranch, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FollowUpFlowBuilderProps {
  initialTemplateId: string;
  followUps: FollowUp[];
  templates: Template[];
  onUpdate: (followUps: any[]) => void; // Changed from onChange to onUpdate
  knowledgeBaseId?: string;
  knowledgeBases?: KnowledgeBase[];
}

const FollowUpFlowBuilder: React.FC<FollowUpFlowBuilderProps> = ({
  initialTemplateId,
  followUps,
  templates,
  onUpdate,
  knowledgeBaseId,
  knowledgeBases = []
}) => {
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [localFollowUps, setLocalFollowUps] = useState<FollowUp[]>(followUps);
  
  // Update local state when props change
  useEffect(() => {
    setLocalFollowUps(followUps);
  }, [followUps]);
  
  // Add a new follow-up
  const handleAddFollowUp = () => {
    const newFollowUp: FollowUp = {
      id: `followup-${Date.now()}`,
      templateId: initialTemplateId,
      delayDays: 3,
      enabled: true,
      condition: 'no-response',
      conditions: [{ type: 'no-response' }] // Initialize enhanced conditions
    };
    
    const updatedFollowUps = [...localFollowUps, newFollowUp];
    setLocalFollowUps(updatedFollowUps);
    onUpdate(updatedFollowUps);
  };
  
  // Remove a follow-up
  const handleRemoveFollowUp = (id: string) => {
    const updatedFollowUps = localFollowUps.filter(fu => fu.id !== id);
    setLocalFollowUps(updatedFollowUps);
    onUpdate(updatedFollowUps);
  };
  
  // Update a follow-up
  const handleUpdateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    const updatedFollowUps = localFollowUps.map(fu => 
      fu.id === id ? { ...fu, ...updates } : fu
    );
    setLocalFollowUps(updatedFollowUps);
    onUpdate(updatedFollowUps);
  };

  // Add a condition to a follow-up
  const handleAddCondition = (followUpId: string, conditionType: FollowUpCondition['type']) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp) return;

    const newCondition: FollowUpCondition = { type: conditionType };
    if (conditionType === 'keyword') {
      newCondition.keywords = [''];
    }

    const updatedConditions = followUp.conditions ? [...followUp.conditions, newCondition] : [newCondition];
    
    handleUpdateFollowUp(followUpId, { 
      conditions: updatedConditions,
      // Update legacy condition field to maintain backward compatibility
      condition: updatedConditions.some(c => c.type === 'no-response') ? 'no-response' : 'all'
    });
  };

  // Remove a condition from a follow-up
  const handleRemoveCondition = (followUpId: string, index: number) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp || !followUp.conditions) return;

    const updatedConditions = [...followUp.conditions];
    updatedConditions.splice(index, 1);
    
    // If we removed all conditions, add a default one
    if (updatedConditions.length === 0) {
      updatedConditions.push({ type: 'no-response' });
    }

    handleUpdateFollowUp(followUpId, { 
      conditions: updatedConditions,
      // Update legacy condition field to maintain backward compatibility
      condition: updatedConditions.some(c => c.type === 'no-response') ? 'no-response' : 'all'
    });
  };

  // Update a specific condition in a follow-up
  const handleUpdateCondition = (followUpId: string, index: number, updates: Partial<FollowUpCondition>) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp || !followUp.conditions) return;

    const updatedConditions = [...followUp.conditions];
    updatedConditions[index] = { ...updatedConditions[index], ...updates };
    
    handleUpdateFollowUp(followUpId, { 
      conditions: updatedConditions,
      // Update legacy condition field to maintain backward compatibility
      condition: updatedConditions.some(c => c.type === 'no-response') ? 'no-response' : 'all'
    });
  };

  // Add a keyword to a condition
  const handleAddKeyword = (followUpId: string, conditionIndex: number) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp || !followUp.conditions) return;

    const condition = followUp.conditions[conditionIndex];
    if (condition.type !== 'keyword' || !condition.keywords) return;

    const updatedKeywords = [...condition.keywords, ''];
    handleUpdateCondition(followUpId, conditionIndex, { keywords: updatedKeywords });
  };

  // Remove a keyword from a condition
  const handleRemoveKeyword = (followUpId: string, conditionIndex: number, keywordIndex: number) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp || !followUp.conditions) return;

    const condition = followUp.conditions[conditionIndex];
    if (condition.type !== 'keyword' || !condition.keywords) return;

    const updatedKeywords = [...condition.keywords];
    updatedKeywords.splice(keywordIndex, 1);
    
    // If we removed all keywords, add a default empty one
    if (updatedKeywords.length === 0) {
      updatedKeywords.push('');
    }

    handleUpdateCondition(followUpId, conditionIndex, { keywords: updatedKeywords });
  };

  // Update a keyword in a condition
  const handleUpdateKeyword = (followUpId: string, conditionIndex: number, keywordIndex: number, value: string) => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    if (!followUp || !followUp.conditions) return;

    const condition = followUp.conditions[conditionIndex];
    if (condition.type !== 'keyword' || !condition.keywords) return;

    const updatedKeywords = [...condition.keywords];
    updatedKeywords[keywordIndex] = value;

    handleUpdateCondition(followUpId, conditionIndex, { keywords: updatedKeywords });
  };
  
  // Connect follow-ups (for the flow builder)
  const handleConnectFollowUps = (sourceId: string, targetId: string, type: 'onResponse' | 'onNoResponse') => {
    const updatedFollowUps = localFollowUps.map(fu => {
      if (fu.id === sourceId) {
        return {
          ...fu,
          nextSteps: {
            ...fu.nextSteps,
            [type]: targetId
          }
        };
      }
      return fu;
    });
    
    setLocalFollowUps(updatedFollowUps);
    onUpdate(updatedFollowUps);
  };
  
  // Get template name by ID
  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Unknown Template';
  };
  
  // Get next follow-up in chain
  const getNextFollowUp = (followUpId: string, type: 'onResponse' | 'onNoResponse') => {
    const followUp = localFollowUps.find(fu => fu.id === followUpId);
    const nextId = followUp?.nextSteps?.[type];
    
    if (nextId) {
      return localFollowUps.find(fu => fu.id === nextId);
    }
    
    return undefined;
  };

  // Render condition icon based on type
  const renderConditionIcon = (type: FollowUpCondition['type']) => {
    switch (type) {
      case 'no-response':
        return <ArrowDownCircle className="h-4 w-4" />;
      case 'positive-response':
        return <ThumbsUp className="h-4 w-4" />;
      case 'negative-response':
        return <ThumbsDown className="h-4 w-4" />;
      case 'keyword':
        return <Search className="h-4 w-4" />;
      case 'all':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Render condition label based on type
  const getConditionLabel = (type: FollowUpCondition['type']) => {
    switch (type) {
      case 'no-response':
        return 'No response received';
      case 'positive-response':
        return 'Positive response';
      case 'negative-response':
        return 'Negative response';
      case 'keyword':
        return 'Message contains keywords';
      case 'all':
        return 'All contacts';
      default:
        return 'Unknown condition';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-medium">
          Follow-up Messages
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showFlowBuilder}
              onCheckedChange={setShowFlowBuilder}
              id="flow-builder-toggle"
            />
            <label
              htmlFor="flow-builder-toggle"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Flow Builder
            </label>
          </div>
          
          <Button onClick={handleAddFollowUp} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Follow-up
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showFlowBuilder ? (
          <div className="space-y-4">
            <div className="text-left text-muted-foreground text-sm mb-4">
              Follow-ups are evaluated in numerical order. Connections (arrows) show what happens after a follow-up, based on whether there's a response or not.
            </div>
            
            {/* Initial message */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="ml-4 flex-grow">
                <Card className="border-primary bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="font-medium">Initial Message</span>
                      </div>
                      <Badge variant="outline">{getTemplateName(initialTemplateId)}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Branches for initial message */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ArrowDownCircle className="h-4 w-4 mr-1" />
                      <span>If no response:</span>
                    </div>
                    
                    {localFollowUps.length > 0 ? (
                      <Select 
                        defaultValue={localFollowUps[0]?.id}
                        onValueChange={(value) => {
                          // This would require a connection in the parent component
                          console.log("Selected first follow-up:", value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select follow-up" />
                        </SelectTrigger>
                        <SelectContent>
                          {localFollowUps.map(fu => (
                            <SelectItem key={fu.id} value={fu.id}>
                              Follow-up {localFollowUps.indexOf(fu) + 1} ({fu.delayDays} days)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="py-2 px-3 border rounded text-sm text-muted-foreground bg-muted/50">
                        No follow-ups configured
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>If response received:</span>
                    </div>
                    <div className="py-2 px-3 border rounded text-sm text-muted-foreground bg-muted/50">
                      End of sequence
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Follow-up messages */}
            {localFollowUps.map((followUp, index) => (
              <div key={followUp.id} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  {index + 2}
                </div>
                <div className="ml-4 flex-grow">
                  <Card className={cn(
                    "border-secondary relative",
                    !followUp.enabled && "opacity-60"
                  )}>
                    {!followUp.enabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded z-10">
                        <Badge variant="outline" className="bg-muted">Disabled</Badge>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-secondary" />
                          <span className="font-medium">Follow-up {index + 1}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {followUp.delayDays} days
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getTemplateName(followUp.templateId)}</Badge>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveFollowUp(followUp.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Follow-up settings */}
                      <div className="mt-3 text-sm grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Template</label>
                          <Select 
                            value={followUp.templateId}
                            onValueChange={(value) => handleUpdateFollowUp(followUp.id, { templateId: value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-muted-foreground">Conditions</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-0" align="end">
                                <div className="p-2">
                                  <p className="text-xs text-muted-foreground mb-2">Add condition</p>
                                  <div className="space-y-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full justify-start text-left"
                                      onClick={() => handleAddCondition(followUp.id, 'no-response')}
                                    >
                                      <ArrowDownCircle className="h-3.5 w-3.5 mr-2" />
                                      No response
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full justify-start text-left"
                                      onClick={() => handleAddCondition(followUp.id, 'positive-response')}
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5 mr-2" />
                                      Positive response
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full justify-start text-left"
                                      onClick={() => handleAddCondition(followUp.id, 'negative-response')}
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5 mr-2" />
                                      Negative response
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full justify-start text-left"
                                      onClick={() => handleAddCondition(followUp.id, 'keyword')}
                                    >
                                      <Search className="h-3.5 w-3.5 mr-2" />
                                      Contains keywords
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full justify-start text-left"
                                      onClick={() => handleAddCondition(followUp.id, 'all')}
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                      All contacts
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2 mt-2">
                            {followUp.conditions && followUp.conditions.length > 0 ? (
                              followUp.conditions.map((condition, conditionIndex) => (
                                <div key={conditionIndex} className="flex items-start gap-1 border rounded-md p-2">
                                  <div className="pt-0.5">
                                    {renderConditionIcon(condition.type)}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs">{getConditionLabel(condition.type)}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-5 w-5 p-0"
                                        onClick={() => handleRemoveCondition(followUp.id, conditionIndex)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    
                                    {condition.type === 'keyword' && condition.keywords && (
                                      <div className="space-y-2 mt-1">
                                        {condition.keywords.map((keyword, keywordIndex) => (
                                          <div key={keywordIndex} className="flex items-center gap-1">
                                            <Input 
                                              value={keyword}
                                              onChange={(e) => handleUpdateKeyword(followUp.id, conditionIndex, keywordIndex, e.target.value)}
                                              className="h-6 text-xs"
                                              placeholder="Enter keyword"
                                            />
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-6 w-6 p-0"
                                              onClick={() => handleRemoveKeyword(followUp.id, conditionIndex, keywordIndex)}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 text-xs w-full"
                                          onClick={() => handleAddKeyword(followUp.id, conditionIndex)}
                                        >
                                          <Plus className="h-3 w-3 mr-1" /> Add keyword
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-muted-foreground border rounded p-2">
                                No conditions set
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Delay (days)</label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="30" 
                            className="h-8"
                            value={followUp.delayDays}
                            onChange={(e) => handleUpdateFollowUp(followUp.id, { delayDays: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Enabled</label>
                          <div className="pt-1">
                            <Switch 
                              checked={followUp.enabled}
                              onCheckedChange={(checked) => handleUpdateFollowUp(followUp.id, { enabled: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Branches for follow-up message */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <ArrowDownCircle className="h-4 w-4 mr-1" />
                        <span>If no response:</span>
                      </div>
                      
                      <Select 
                        value={followUp.nextSteps?.onNoResponse}
                        onValueChange={(value) => {
                          if (value === 'end') {
                            handleUpdateFollowUp(followUp.id, {
                              nextSteps: {
                                ...followUp.nextSteps,
                                onNoResponse: undefined
                              }
                            });
                          } else {
                            handleConnectFollowUps(followUp.id, value, 'onNoResponse');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select next step" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="end">End sequence</SelectItem>
                          {localFollowUps
                            .filter(fu => fu.id !== followUp.id) // Don't allow self-reference
                            .map(fu => (
                              <SelectItem key={fu.id} value={fu.id}>
                                Follow-up {localFollowUps.indexOf(fu) + 1} ({fu.delayDays} days)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      
                      {followUp.nextSteps?.onNoResponse && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          <span>Goes to Follow-up {localFollowUps.findIndex(fu => fu.id === followUp.nextSteps?.onNoResponse) + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>If response received:</span>
                      </div>
                      
                      <Select 
                        value={followUp.nextSteps?.onResponse}
                        onValueChange={(value) => {
                          if (value === 'end') {
                            handleUpdateFollowUp(followUp.id, {
                              nextSteps: {
                                ...followUp.nextSteps,
                                onResponse: undefined
                              }
                            });
                          } else {
                            handleConnectFollowUps(followUp.id, value, 'onResponse');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select next step" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="end">End sequence</SelectItem>
                          {localFollowUps
                            .filter(fu => fu.id !== followUp.id) // Don't allow self-reference
                            .map(fu => (
                              <SelectItem key={fu.id} value={fu.id}>
                                Follow-up {localFollowUps.indexOf(fu) + 1} ({fu.delayDays} days)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      
                      {followUp.nextSteps?.onResponse && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          <span>Goes to Follow-up {localFollowUps.findIndex(fu => fu.id === followUp.nextSteps?.onResponse) + 1}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {localFollowUps.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <GitBranch className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No follow-up messages configured yet</p>
                <Button onClick={handleAddFollowUp} variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Follow-up
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Enhanced instructions with emojis and better spacing */}
            <div className="p-5 bg-blue-50 text-blue-800 rounded-md mb-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                How to Build a Follow-up Sequence
              </h3>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 text-lg">➕</span>
                  <span>Click <strong>Add Follow-up</strong> to create a new follow-up message</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">⏱️</span>
                  <span>Set the number of days to wait before sending the follow-up</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🔄</span>
                  <span>Choose conditions: no response, positive/negative responses, or keywords</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🔀</span>
                  <span>Toggle the Flow Builder to visually connect follow-ups</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🔗</span>
                  <span>Create multi-step sequences by connecting follow-ups together</span>
                </li>
              </ul>
            </div>
            
            {/* Simple list view */}
            <Tabs defaultValue="followups">
              <TabsList className="mb-4">
                <TabsTrigger value="followups">Follow-ups</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="followups">
                {localFollowUps.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No follow-up messages configured yet</p>
                    <Button onClick={handleAddFollowUp} variant="outline" className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Follow-up
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localFollowUps.map((followUp, index) => (
                      <div key={followUp.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          {index + 1}
                        </div>
                        
                        <div className="flex-grow space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">Follow-up message</div>
                              {!followUp.enabled && (
                                <Badge variant="outline" className="bg-muted">Disabled</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {followUp.delayDays} days after
                              </Badge>

                              {/* Display condition badges based on enhanced conditions */}
                              {followUp.conditions && followUp.conditions.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {followUp.conditions.map((condition, idx) => (
                                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                      {renderConditionIcon(condition.type)}
                                      <span className="text-xs">
                                        {condition.type === 'keyword' 
                                          ? `Keywords (${condition.keywords?.length || 0})` 
                                          : condition.type.split('-').join(' ')}
                                      </span>
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Legacy condition display as fallback */}
                              {(!followUp.conditions || followUp.conditions.length === 0) && (
                                <Badge variant="secondary">
                                  {followUp.condition === 'no-response' ? 'If no response' : 'Send to all'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-muted rounded-md">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm text-muted-foreground">Template</label>
                                <Switch
                                  checked={followUp.enabled}
                                  onCheckedChange={(checked) => handleUpdateFollowUp(followUp.id, { enabled: checked })}
                                />
                              </div>
                              
                              <Select 
                                value={followUp.templateId}
                                onValueChange={(value) => handleUpdateFollowUp(followUp.id, { templateId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                  {templates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>
                                      {template.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm text-muted-foreground">Send after</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="30" 
                                    className="h-8 w-20"
                                    value={followUp.delayDays}
                                    onChange={(e) => handleUpdateFollowUp(followUp.id, { delayDays: parseInt(e.target.value) || 1 })}
                                  />
                                  <span className="text-sm">days</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="text-sm text-muted-foreground">Conditions</label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-0" align="end">
                                      <div className="p-2">
                                        <p className="text-xs text-muted-foreground mb-2">Add condition</p>
                                        <div className="space-y-1">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-left"
                                            onClick={() => handleAddCondition(followUp.id, 'no-response')}
                                          >
                                            <ArrowDownCircle className="h-3.5 w-3.5 mr-2" />
                                            No response
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-left"
                                            onClick={() => handleAddCondition(followUp.id, 'positive-response')}
                                          >
                                            <ThumbsUp className="h-3.5 w-3.5 mr-2" />
                                            Positive response
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-left"
                                            onClick={() => handleAddCondition(followUp.id, 'negative-response')}
                                          >
                                            <ThumbsDown className="h-3.5 w-3.5 mr-2" />
                                            Negative response
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-left"
                                            onClick={() => handleAddCondition(followUp.id, 'keyword')}
                                          >
                                            <Search className="h-3.5 w-3.5 mr-2" />
                                            Contains keywords
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-left"
                                            onClick={() => handleAddCondition(followUp.id, 'all')}
                                          >
                                            <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                            All contacts
                                          </Button>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {/* Condition list */}
                                <div className="mt-1 space-y-2">
                                  {followUp.conditions && followUp.conditions.length > 0 ? (
                                    <div className="grid gap-1">
                                      {followUp.conditions.map((condition, conditionIndex) => (
                                        <div key={conditionIndex} className="flex items-center gap-1 border rounded-md p-1.5 text-xs">
                                          {renderConditionIcon(condition.type)}
                                          <span className="flex-grow">{getConditionLabel(condition.type)}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-5 w-5 p-0"
                                            onClick={() => handleRemoveCondition(followUp.id, conditionIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    // Legacy condition support
                                    <Select 
                                      value={followUp.condition}
                                      onValueChange={(value) => {
                                        handleUpdateFollowUp(followUp.id, { 
                                          condition: value as 'no-response' | 'all',
                                          conditions: [{ type: value as 'no-response' | 'all' }]
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select condition" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="no-response">No Response</SelectItem>
                                        <SelectItem value="all">Send to All</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>

                                {/* Keyword editor for keyword conditions */}
                                {followUp.conditions && followUp.conditions.some(c => c.type === 'keyword') && (
                                  <div className="mt-2 space-y-2 border-t pt-2">
                                    <label className="text-xs text-muted-foreground">Keywords to match:</label>
                                    {followUp.conditions.map((condition, conditionIndex) => {
                                      if (condition.type !== 'keyword' || !condition.keywords) return null;
                                      
                                      return (
                                        <div key={conditionIndex} className="space-y-1">
                                          {condition.keywords.map((keyword, keywordIndex) => (
                                            <div key={keywordIndex} className="flex items-center gap-1">
                                              <Input 
                                                value={keyword}
                                                onChange={(e) => handleUpdateKeyword(followUp.id, conditionIndex, keywordIndex, e.target.value)}
                                                className="h-6 text-xs"
                                                placeholder="Enter keyword"
                                              />
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 w-6 p-0"
                                                onClick={() => handleRemoveKeyword(followUp.id, conditionIndex, keywordIndex)}
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ))}
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 text-xs w-full"
                                            onClick={() => handleAddKeyword(followUp.id, conditionIndex)}
                                          >
                                            <Plus className="h-3 w-3 mr-1" /> Add keyword
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveFollowUp(followUp.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={handleAddFollowUp} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Follow-up
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <h3 className="font-medium">Advanced Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how follow-up messages are sent and when they should stop.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Stop on any response</label>
                        <p className="text-sm text-muted-foreground">
                          Automatically stop sending follow-ups when a contact responds
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Business hours only</label>
                        <p className="text-sm text-muted-foreground">
                          Only send follow-ups during business hours (9AM-5PM)
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Weekdays only</label>
                        <p className="text-sm text-muted-foreground">
                          Avoid sending follow-ups on weekends
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpFlowBuilder;
