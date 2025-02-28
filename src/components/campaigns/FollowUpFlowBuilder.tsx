
import React, { useState, useRef, useEffect } from 'react';
import { FollowUp, Template, FollowUpCondition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, ArrowRight, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import AdvancedConditionEditor from './AdvancedConditionEditor';

interface FollowUpDraft extends Omit<FollowUp, 'id'> {
  tempId?: string;
}

interface FollowUpNode {
  id: string;
  type: 'initial' | 'followup';
  data: FollowUpDraft | { templateId: string };
  position: { x: number; y: number };
  connections: {
    onResponse?: string;
    onNoResponse?: string;
  };
}

interface FollowUpFlowBuilderProps {
  initialTemplateId: string;
  followUps: FollowUp[];
  templates: Template[];
  onUpdate: (followUps: FollowUp[]) => void;
}

const FollowUpFlowBuilder: React.FC<FollowUpFlowBuilderProps> = ({
  initialTemplateId,
  followUps,
  templates,
  onUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<FollowUpNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editingNodeData, setEditingNodeData] = useState<FollowUpDraft | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<'onResponse' | 'onNoResponse' | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Initialize the flow with the existing follow-ups
  useEffect(() => {
    // Create the initial message node
    const initialNode: FollowUpNode = {
      id: 'initial',
      type: 'initial',
      data: { templateId: initialTemplateId },
      position: { x: 100, y: 100 },
      connections: {}
    };

    // Create nodes for each follow-up
    const followUpNodes: FollowUpNode[] = followUps.map((followUp, index) => ({
      id: followUp.id,
      type: 'followup',
      data: followUp,
      position: { x: 400, y: 100 + index * 150 },
      connections: {
        onResponse: followUp.nextSteps?.onResponse,
        onNoResponse: followUp.nextSteps?.onNoResponse
      }
    }));

    // Set all nodes
    setNodes([initialNode, ...followUpNodes]);
  }, [initialTemplateId, followUps]);

  // Helper function to get a template name by ID
  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  // Add a new follow-up node
  const addFollowUpNode = () => {
    const newNodeId = `temp-followup-${Date.now()}`;
    const newNode: FollowUpNode = {
      id: newNodeId,
      type: 'followup',
      data: {
        tempId: newNodeId,
        templateId: initialTemplateId, // Default to same as initial
        delayDays: 2,
        enabled: true,
        condition: 'no-response',
        priority: 1
      },
      position: { 
        x: Math.max(...nodes.map(n => n.position.x)) + 250, 
        y: 100 + nodes.length * 50 
      },
      connections: {}
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNodeId);
    setIsEditingNode(true);
    setEditingNodeData(newNode.data as FollowUpDraft);
  };

  // Handle node selection
  const selectNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.type === 'followup') {
      setEditingNodeData(node.data as FollowUpDraft);
    }
  };

  // Handle node deletion
  const deleteNode = (nodeId: string) => {
    // Don't allow deleting the initial node
    if (nodeId === 'initial') return;

    // Remove the node
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    
    // Remove any connections to this node
    const nodesWithUpdatedConnections = updatedNodes.map(node => ({
      ...node,
      connections: {
        onResponse: node.connections.onResponse === nodeId ? undefined : node.connections.onResponse,
        onNoResponse: node.connections.onNoResponse === nodeId ? undefined : node.connections.onNoResponse
      }
    }));

    setNodes(nodesWithUpdatedConnections);
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setIsEditingNode(false);
      setEditingNodeData(null);
    }

    // Update parent component
    updateFollowUps(nodesWithUpdatedConnections);
  };

  // Handle node data updates
  const updateNodeData = (data: FollowUpDraft) => {
    if (!selectedNode) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNode) {
        return {
          ...node,
          data: { ...data }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setEditingNodeData(data);

    // Update parent component
    updateFollowUps(updatedNodes);
  };

  // Handle advanced conditions update
  const handleConditionsUpdate = (conditions: FollowUpCondition[]) => {
    if (!editingNodeData) return;
    
    const updatedData = {
      ...editingNodeData,
      conditions
    };
    
    updateNodeData(updatedData);
  };

  // Convert the nodes to follow-ups for the parent component
  const updateFollowUps = (updatedNodes: FollowUpNode[]) => {
    const newFollowUps: FollowUp[] = updatedNodes
      .filter(node => node.type === 'followup')
      .map(node => {
        const data = node.data as FollowUpDraft;
        return {
          id: node.id,
          templateId: data.templateId,
          delayDays: data.delayDays || 2,
          enabled: data.enabled !== false,
          condition: data.condition,
          conditions: data.conditions,
          priority: data.priority,
          nextSteps: {
            onResponse: node.connections.onResponse,
            onNoResponse: node.connections.onNoResponse
          }
        };
      });

    onUpdate(newFollowUps);
  };

  // Handle node dragging
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (isCreatingConnection) return;
    
    setIsDragging(true);
    setDragNodeId(nodeId);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragNodeId) return;

    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;

    const updatedNodes = nodes.map(node => {
      if (node.id === dragNodeId) {
        return {
          ...node,
          position: {
            x: node.position.x + deltaX,
            y: node.position.y + deltaY
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
  };

  // Handle connection creation
  const startConnection = (nodeId: string, type: 'onResponse' | 'onNoResponse') => {
    setIsCreatingConnection(true);
    setConnectionSource(nodeId);
    setConnectionType(type);
  };

  const completeConnection = (targetId: string) => {
    if (!connectionSource || !connectionType || connectionSource === targetId) {
      cancelConnection();
      return;
    }

    const updatedNodes = nodes.map(node => {
      if (node.id === connectionSource) {
        return {
          ...node,
          connections: {
            ...node.connections,
            [connectionType]: targetId
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setIsCreatingConnection(false);
    setConnectionSource(null);
    setConnectionType(null);

    // Update parent component
    updateFollowUps(updatedNodes);
  };

  const cancelConnection = () => {
    setIsCreatingConnection(false);
    setConnectionSource(null);
    setConnectionType(null);
  };

  // Draw connections between nodes
  const renderConnections = () => {
    if (!containerRef.current) return null;

    const connections: React.ReactNode[] = [];

    nodes.forEach(node => {
      ['onResponse', 'onNoResponse'].forEach((connType) => {
        const targetId = node.connections[connType as 'onResponse' | 'onNoResponse'];
        if (targetId) {
          const sourceNode = node;
          const targetNode = nodes.find(n => n.id === targetId);
          
          if (targetNode) {
            // Calculate connection points
            const sourceX = sourceNode.position.x + 150; // right side of source
            const sourceY = sourceNode.position.y + 50; // middle of source
            const targetX = targetNode.position.x; // left side of target
            const targetY = targetNode.position.y + 50; // middle of target
            
            // Calculate control points for the curved line
            const controlX1 = sourceX + 50;
            const controlX2 = targetX - 50;
            
            // Path data for a curved line
            const pathData = `M ${sourceX} ${sourceY} C ${controlX1} ${sourceY}, ${controlX2} ${targetY}, ${targetX} ${targetY}`;
            
            // Color based on connection type
            const color = connType === 'onResponse' ? '#16a34a' : '#dc2626'; // green for response, red for no response
            
            connections.push(
              <g key={`${node.id}-${connType}-${targetId}`}>
                <path 
                  d={pathData} 
                  stroke={color} 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray={connType === 'onNoResponse' ? "5,5" : "none"}
                />
                <polygon 
                  points={`${targetX},${targetY} ${targetX-10},${targetY-5} ${targetX-10},${targetY+5}`} 
                  fill={color} 
                />
                <text 
                  x={(sourceX + targetX) / 2} 
                  y={(sourceY + targetY) / 2 - 10} 
                  textAnchor="middle" 
                  fill={color} 
                  fontSize="12"
                  className="bg-white px-1"
                >
                  {connType === 'onResponse' ? 'Response' : 'No Response'}
                </text>
              </g>
            );
          }
        }
      });
    });

    // Draw the connection being created
    if (isCreatingConnection && connectionSource && connectionType) {
      const sourceNode = nodes.find(n => n.id === connectionSource);
      if (sourceNode) {
        // Calculate connection points
        const sourceX = sourceNode.position.x + 150; // right side of source
        const sourceY = sourceNode.position.y + 50; // middle of source
        const targetX = sourceX + 100; // temporary end point
        const targetY = sourceY;
        
        // Path data for a straight line
        const pathData = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
        
        // Color based on connection type
        const color = connectionType === 'onResponse' ? '#16a34a' : '#dc2626';
        
        connections.push(
          <path 
            key="temp-connection" 
            d={pathData} 
            stroke={color} 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray={connectionType === 'onNoResponse' ? "5,5" : "none"}
          />
        );
      }
    }

    return connections;
  };

  return (
    <div className="follow-up-flow-builder border rounded-md p-4 bg-gray-50 relative" style={{ height: '600px' }}>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Follow-Up Flow Builder</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addFollowUpNode}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>
      
      <div className="flex h-full">
        {/* Flow Canvas */}
        <div 
          ref={containerRef}
          className="flow-canvas border rounded-md bg-white flex-1 relative overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={isCreatingConnection ? cancelConnection : undefined}
        >
          <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
            {renderConnections()}
          </svg>
          
          {nodes.map(node => (
            <div
              key={node.id}
              className={cn(
                "flow-node absolute p-3 border rounded-md w-[300px] cursor-move",
                node.type === 'initial' ? "bg-blue-50 border-blue-200" : "bg-white",
                selectedNode === node.id && "ring-2 ring-primary"
              )}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                zIndex: selectedNode === node.id ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={(e) => {
                e.stopPropagation();
                selectNode(node.id);
                if (isCreatingConnection) {
                  completeConnection(node.id);
                }
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">
                    {node.type === 'initial' ? 'Initial Message' : `Follow-up #${nodes.indexOf(node)}`}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getTemplateName((node.data as any).templateId)}
                  </p>
                </div>
                {node.type !== 'initial' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {node.type === 'followup' && (
                <div className="flow-node-details text-sm">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="bg-blue-50">
                      Day +{(node.data as FollowUpDraft).delayDays || 0}
                    </Badge>
                    
                    {(node.data as FollowUpDraft).condition && (
                      <Badge variant="outline" className={
                        (node.data as FollowUpDraft).condition === 'no-response' 
                          ? "bg-red-50" 
                          : "bg-green-50"
                      }>
                        {(node.data as FollowUpDraft).condition === 'no-response' 
                          ? "No Response" 
                          : "All Contacts"}
                      </Badge>
                    )}
                    
                    {(node.data as FollowUpDraft).conditions && (node.data as FollowUpDraft).conditions.length > 0 && (
                      <Badge variant="outline" className="bg-purple-50">
                        {(node.data as FollowUpDraft).conditions.length} Advanced Condition{(node.data as FollowUpDraft).conditions.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    
                    {!(node.data as FollowUpDraft).enabled && (
                      <Badge variant="outline" className="bg-yellow-50">
                        Disabled
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flow-node-connections flex justify-between mt-3 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 bg-green-50 hover:bg-green-100 border-green-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    startConnection(node.id, 'onResponse');
                  }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  If Response
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 bg-red-50 hover:bg-red-100 border-red-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    startConnection(node.id, 'onNoResponse');
                  }}
                >
                  <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                  If No Response
                </Button>
              </div>
            </div>
          ))}
          
          {isCreatingConnection && (
            <div className="fixed bottom-4 right-4 bg-white p-2 rounded-md shadow-md border z-20">
              <p className="text-sm font-medium">
                {connectionType === 'onResponse' ? 'If Response: ' : 'If No Response: '}
                Select a destination node or click empty space to cancel
              </p>
            </div>
          )}
        </div>
        
        {/* Properties Panel */}
        {selectedNode && (
          <div className="properties-panel w-[350px] ml-4 border rounded-md bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium mb-3">
                {nodes.find(n => n.id === selectedNode)?.type === 'initial' 
                  ? 'Initial Message Properties' 
                  : 'Follow-up Properties'}
              </h3>
              
              {nodes.find(n => n.id === selectedNode)?.type === 'initial' ? (
                <div className="space-y-3">
                  <div>
                    <Label>Template</Label>
                    <div className="text-sm mt-1">{getTemplateName(initialTemplateId)}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the initial message that will be sent to all contacts in this campaign.
                  </p>
                </div>
              ) : (
                editingNodeData && (
                  <div className="space-y-4">
                    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="template">Message Template</Label>
                          <Select 
                            value={editingNodeData.templateId} 
                            onValueChange={(value) => updateNodeData({...editingNodeData, templateId: value})}
                          >
                            <SelectTrigger id="template">
                              <SelectValue placeholder="Select Template" />
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
                        
                        <div className="space-y-2">
                          <Label htmlFor="delay">Delay (days)</Label>
                          <Input 
                            id="delay" 
                            type="number" 
                            min="1" 
                            value={editingNodeData.delayDays || 2} 
                            onChange={(e) => updateNodeData({
                              ...editingNodeData, 
                              delayDays: parseInt(e.target.value) || 1
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Days to wait after the previous message before sending this one.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="condition">Basic Condition</Label>
                          <Select 
                            value={editingNodeData.condition || 'no-response'} 
                            onValueChange={(value: 'no-response' | 'all') => updateNodeData({
                              ...editingNodeData, 
                              condition: value
                            })}
                          >
                            <SelectTrigger id="condition">
                              <SelectValue placeholder="When to send" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-response">Only if no response</SelectItem>
                              <SelectItem value="all">Send to all contacts</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            For more complex conditions, use the Advanced tab.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Input 
                            id="priority" 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={editingNodeData.priority || 1} 
                            onChange={(e) => updateNodeData({
                              ...editingNodeData, 
                              priority: parseInt(e.target.value) || 1
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Higher priority follow-ups will be sent first if multiple conditions are met.
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch 
                            id="enabled" 
                            checked={editingNodeData.enabled !== false}
                            onCheckedChange={(checked) => updateNodeData({
                              ...editingNodeData, 
                              enabled: checked
                            })}
                          />
                          <Label htmlFor="enabled">Enabled</Label>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="advanced" className="mt-4">
                        <AdvancedConditionEditor 
                          conditions={editingNodeData.conditions || []}
                          onChange={handleConditionsUpdate}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpFlowBuilder;
