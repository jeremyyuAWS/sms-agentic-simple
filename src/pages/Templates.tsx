import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Template, Contact, TemplateCategory, Campaign } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Tag, 
  Copy, 
  HelpCircle, 
  Info, 
  Filter, 
  X, 
  CheckCircle2, 
  Circle, 
  Share2,
  BarChart3,
  Clock,
  ArrowUpRight,
  Split,
  BarChart,
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Templates = () => {
  const { 
    templates, 
    contacts, 
    campaigns,
    templateCategories, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    duplicateTemplate,
    assignTemplateToCategory,
    removeTemplateFromCategory,
    createTemplateCategory,
    shareTemplate,
    unshareTemplate,
    trackTemplateUsage,
    setupABTest,
    createCampaign
  } = useApp();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [isABTestDialogOpen, setIsABTestDialogOpen] = useState(false);
  const [isCampaignIntegrationOpen, setIsCampaignIntegrationOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    body: '',
    categoryIds: [] as string[]
  });
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [extractedVariables, setExtractedVariables] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{[key: string]: string}>({});
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: 'blue',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sharingOptions, setSharingOptions] = useState({
    isPublic: false,
    userIds: [] as string[]
  });
  const [showShared, setShowShared] = useState(false);
  const [abTestSettings, setAbTestSettings] = useState({
    name: '',
    description: '',
    templates: [] as { templateId: string, percentage: number }[],
    testDuration: 24,
    winnerCriteria: 'response-rate' as 'response-rate' | 'positive-response-rate' | 'manual'
  });
  const [campaignIntegration, setCampaignIntegration] = useState({
    campaignId: '',
    templateId: '',
    action: 'create-campaign' as 'create-campaign' | 'add-to-existing' | 'create-ab-test'
  });

  const availableColors = [
    { name: 'Blue', value: 'blue', bg: '#EBF5FF', text: '#1E40AF', border: '#BFDBFE' },
    { name: 'Green', value: 'green', bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
    { name: 'Red', value: 'red', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
    { name: 'Purple', value: 'purple', bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
    { name: 'Orange', value: 'orange', bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
    { name: 'Pink', value: 'pink', bg: '#FDF2F8', text: '#BE185D', border: '#FBCFE8' },
    { name: 'Indigo', value: 'indigo', bg: '#EEF2FF', text: '#3730A3', border: '#C7D2FE' },
    { name: 'Teal', value: 'teal', bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
    { name: 'Yellow', value: 'yellow', bg: '#FEFCE8', text: '#A16207', border: '#FEF08A' },
    { name: 'Gray', value: 'gray', bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' }
  ];

  // Mock users for sharing (in a real app, these would come from a users API)
  const mockUsers = [
    { id: 'user-1', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
    { id: 'user-2', name: 'John Doe', email: 'john@example.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
    { id: 'user-3', name: 'Maria Rodriguez', email: 'maria@example.com', avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez' },
    { id: 'user-4', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' }
  ];

  // Reset template form when closing dialog
  useEffect(() => {
    if (!isCreateOpen) {
      setNewTemplate({
        name: '',
        body: '',
        categoryIds: []
      });
      setExtractedVariables([]);
    }
  }, [isCreateOpen]);

  // Reset editing form when closing
  useEffect(() => {
    if (!isEditOpen) {
      setEditingTemplate(null);
    }
  }, [isEditOpen]);

  // Initialize A/B test when dialog opens
  useEffect(() => {
    if (isABTestDialogOpen && selectedTemplate) {
      setAbTestSettings({
        name: `A/B Test - ${selectedTemplate.name}`,
        description: `Testing different variants of ${selectedTemplate.name}`,
        templates: [
          { templateId: selectedTemplate.id, percentage: 50 },
          { templateId: '', percentage: 50 }
        ],
        testDuration: 24,
        winnerCriteria: 'response-rate'
      });
    }
  }, [isABTestDialogOpen, selectedTemplate]);

  // Initialize campaign integration when dialog opens
  useEffect(() => {
    if (isCampaignIntegrationOpen && selectedTemplate) {
      setCampaignIntegration({
        campaignId: '',
        templateId: selectedTemplate.id,
        action: 'create-campaign'
      });
    }
  }, [isCampaignIntegrationOpen, selectedTemplate]);

  // Get available contact fields for template variables
  const getAvailableContactFields = () => {
    // Start with standard contact fields
    const standardFields = [
      { name: 'name', description: 'Contact\'s full name' },
      { name: 'phoneNumber', description: 'Contact\'s phone number' },
      { name: 'email', description: 'Contact\'s email address' },
      { name: 'company', description: 'Company or organization name' },
      { name: 'position', description: 'Job title or position' }
    ];
    
    // Get custom fields from contacts if available
    const customFields = new Set<string>();
    contacts.forEach(contact => {
      Object.keys(contact).forEach(key => {
        // Skip standard fields and id
        if (!['id', 'name', 'phoneNumber', 'email', 'company', 'position'].includes(key)) {
          customFields.add(key);
        }
      });
    });
    
    return {
      standard: standardFields,
      custom: Array.from(customFields).map(field => ({ name: field, description: `Custom field: ${field}` }))
    };
  };

  // Function to extract variables from template body
  const extractVariables = (text: string) => {
    const variableRegex = /\{([^}]+)\}/g;
    const matches = [...text.matchAll(variableRegex)];
    const extractedVars = matches.map(match => match[1].trim());
    const uniqueVars = [...new Set(extractedVars)];
    return uniqueVars;
  };

  // Handle template body change for new template
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setNewTemplate({
      ...newTemplate,
      body: newBody
    });
    
    // Extract variables
    const variables = extractVariables(newBody);
    setExtractedVariables(variables);
  };

  // Handle template body change for editing template
  const handleEditBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editingTemplate) return;
    
    const newBody = e.target.value;
    setEditingTemplate({
      ...editingTemplate,
      body: newBody,
      variables: extractVariables(newBody)
    });
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string, textareaId: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const variableText = `{${variable}}`;
    
    const newText = text.substring(0, start) + variableText + text.substring(end);
    
    if (textareaId === 'body') {
      setNewTemplate({
        ...newTemplate,
        body: newText
      });
      
      // Extract variables including the newly added one
      const variables = extractVariables(newText);
      setExtractedVariables(variables);
    } else if (textareaId === 'edit-body' && editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        body: newText,
        variables: extractVariables(newText)
      });
    }
    
    // Set focus back to textarea for better UX
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + variableText.length;
      textarea.selectionEnd = start + variableText.length;
    }, 0);
  };

  // Handle template creation
  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!newTemplate.body.trim()) {
      toast({
        title: "Error",
        description: "Template body is required.",
        variant: "destructive"
      });
      return;
    }

    createTemplate({
      name: newTemplate.name,
      body: newTemplate.body,
      variables: extractedVariables,
      categoryIds: newTemplate.categoryIds
    });

    setNewTemplate({
      name: '',
      body: '',
      categoryIds: []
    });
    setExtractedVariables([]);
    setIsCreateOpen(false);

    toast({
      title: "Success",
      description: "Template created successfully."
    });
  };

  // Handle template update
  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!editingTemplate.body.trim()) {
      toast({
        title: "Error",
        description: "Template body is required.",
        variant: "destructive"
      });
      return;
    }

    updateTemplate(editingTemplate.id, {
      name: editingTemplate.name,
      body: editingTemplate.body,
      variables: editingTemplate.variables,
      categoryIds: editingTemplate.categoryIds
    });

    setIsEditOpen(false);
    setEditingTemplate(null);

    toast({
      title: "Success",
      description: "Template updated successfully."
    });
  };

  // Handle template editing
  const handleEditTemplate = (template: Template) => {
    setEditingTemplate({...template});
    setIsEditOpen(true);
  };

  // Handle template duplication
  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId);
  };

  // Handle template preview
  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    
    // Initialize preview data with empty values for all variables
    const initialData: {[key: string]: string} = {};
    template.variables.forEach(variable => {
      initialData[variable] = `[${variable}]`;
    });
    
    setPreviewData(initialData);
    setIsPreviewOpen(true);
  };

  // Update preview data for a specific variable
  const handlePreviewDataChange = (variable: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // Render preview with variables replaced
  const renderPreview = () => {
    if (!selectedTemplate) return '';
    
    let preview = selectedTemplate.body;
    Object.entries(previewData).forEach(([variable, value]) => {
      preview = preview.replace(new RegExp(`{${variable}}`, 'g'), value || `[${variable}]`);
    });
    
    return preview;
  };

  // Copy template to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Template copied to clipboard."
      });
    });
  };

  // Function to generate a preview with real contact data
  const generatePreview = (templateBody: string) => {
    if (!templateBody) return "";
    
    // Check if we have contacts to use in the preview
    if (contacts.length > 0) {
      // Use the first contact for preview
      const sampleContact = contacts[0];
      let preview = templateBody;
      
      // Replace all variables with contact data
      Object.keys(sampleContact).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        const value = sampleContact[key] || `[${key}]`;
        preview = preview.replace(regex, String(value));
      });
      
      // Find any remaining variables that weren't replaced
      const remainingVariables = [...preview.matchAll(/{([^}]+)}/g)];
      
      if (remainingVariables.length > 0) {
        // Replace remaining variables with placeholders
        remainingVariables.forEach(match => {
          const variable = match[1];
          preview = preview.replace(new RegExp(`{${variable}}`, 'g'), `[${variable}]`);
        });
      }
      
      return preview;
    } else {
      // No contacts available, just show placeholder variables
      return templateBody.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`);
    }
  };
  
  // Handle template deletion
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setTemplateToDelete(null);
      
      toast({
        title: "Template Deleted",
        description: `Template "${templateToDelete.name}" has been deleted.`
      });
    }
  };

  // Create category
  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    createTemplateCategory(newCategory);
    setNewCategory({
      name: '',
      color: 'blue',
      description: ''
    });
    setIsCategoryDialogOpen(false);

    toast({
      title: "Success",
      description: "Category created successfully."
    });
  };

  // Open sharing dialog
  const handleOpenSharing = (template: Template) => {
    setSelectedTemplate(template);
    setSharingOptions({
      isPublic: template.isPublic || false,
      userIds: template.sharedWith || []
    });
    setIsSharingOpen(true);
  };

  // Open A/B test dialog
  const handleOpenABTest = (template: Template) => {
    setSelectedTemplate(template);
    setIsABTestDialogOpen(true);
  };

  // Open campaign integration dialog
  const handleOpenCampaignIntegration = (template: Template) => {
    setSelectedTemplate(template);
    setIsCampaignIntegrationOpen(true);
  };

  // Handle template sharing
  const handleShareTemplate = () => {
    if (!selectedTemplate) return;
    
    shareTemplate(
      selectedTemplate.id,
      sharingOptions.isPublic,
      sharingOptions.userIds
    );
    
    setIsSharingOpen(false);
    
    toast({
      title: "Template Shared",
      description: sharingOptions.isPublic 
        ? "Template is now publicly available" 
        : `Template has been shared with ${sharingOptions.userIds.length} users`
    });
  };

  // Unshare template
  const handleUnshareTemplate = (templateId: string) => {
    unshareTemplate(templateId);
    
    toast({
      title: "Sharing Disabled",
      description: "Template is no longer shared"
    });
  };

  // Toggle category for template
  const toggleTemplateCategory = (template: Template, categoryId: string) => {
    if (template.categoryIds?.includes(categoryId)) {
      removeTemplateFromCategory(template.id, categoryId);
    } else {
      assignTemplateToCategory(template.id, categoryId);
    }
  };

  // Toggle category filter
  const toggleCategoryFilter = (categoryId: string) => {
    if (activeFilter === categoryId) {
      setActiveFilter(null);
      setActiveTab('all');
    } else {
      setActiveFilter(categoryId);
      setActiveTab('filtered');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveFilter(null);
    setSearchTerm('');
    setActiveTab('all');
    setShowShared(false);
  };

  // Create new A/B test
  const handleCreateABTest = () => {
    // Validate A/B test settings
    if (!abTestSettings.name.trim()) {
      toast({
        title: "Error",
        description: "Campaign name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check if all template variants have been selected
    const hasEmptyTemplates = abTestSettings.templates.some(t => !t.templateId);
    if (hasEmptyTemplates) {
      toast({
        title: "Error",
        description: "All template variants must have a template selected.",
        variant: "destructive"
      });
      return;
    }

    // Ensure percentages add up to 100%
    const totalPercentage = abTestSettings.templates.reduce((sum, t) => sum + t.percentage, 0);
    if (totalPercentage !== 100) {
      toast({
        title: "Error",
        description: "Template percentages must add up to 100%.",
        variant: "destructive"
      });
      return;
    }

    // Create a new campaign with A/B test
    createCampaign({
      name: abTestSettings.name,
      description: abTestSettings.description,
      status: 'draft',
      contactCount: 0,
      updatedAt: new Date(),
      isABTest: true,
      templateVariants: abTestSettings.templates.map(t => ({
        id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Add unique ID
        templateId: t.templateId,
        name: templates.find(template => template.id === t.templateId)?.name || '',
        contactPercentage: t.percentage,
        contactCount: 0
      })),
      testDuration: abTestSettings.testDuration,
      winnerSelectionCriteria: abTestSettings.winnerCriteria,
      testStatus: 'not-started'
    });

    // Close dialog and show success toast
    setIsABTestDialogOpen(false);
    
    toast({
      title: "A/B Test Created",
      description: "New A/B test campaign has been created. Go to Campaigns to configure it further.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Navigate to campaigns page
            window.location.href = '/campaigns';
          }}
        >
          View Campaigns
        </Button>
      )
    });
  };

  // Handle campaign integration
  const handleCampaignIntegration = () => {
    if (!selectedTemplate) return;
    
    switch (campaignIntegration.action) {
      case 'create-campaign':
        // Create a new campaign with the selected template
        createCampaign({
          name: `Campaign with ${selectedTemplate.name}`,
          description: `Campaign using the "${selectedTemplate.name}" template`,
          status: 'draft',
          contactCount: 0,
          updatedAt: new Date(),
          templateId: selectedTemplate.id
        });
        
        trackTemplateUsage(selectedTemplate.id, 'new-campaign');
        
        toast({
          title: "Campaign Created",
          description: "New campaign has been created with this template. Go to Campaigns to configure it further.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Navigate to campaigns page
                window.location.href = '/campaigns';
              }}
            >
              View Campaigns
            </Button>
          )
        });
        break;
        
      case 'create-ab-test':
        // Open the A/B test dialog with this template pre-selected
        setIsABTestDialogOpen(true);
        setIsCampaignIntegrationOpen(false);
        break;
        
      case 'add-to-existing':
        if (!campaignIntegration.campaignId) {
          toast({
            title: "Error",
            description: "Please select a campaign.",
            variant: "destructive"
          });
          return;
        }
        
        // Track the template usage for this campaign
        trackTemplateUsage(selectedTemplate.id, campaignIntegration.campaignId);
        
        toast({
          title: "Template Added to Campaign",
          description: "The template has been associated with the selected campaign."
        });
        break;
    }
    
    setIsCampaignIntegrationOpen(false);
  };

  // Add template variant to A/B test
  const addTemplateVariant = () => {
    if (abTestSettings.templates.length >= 5) {
      toast({
        title: "Error",
        description: "Maximum of 5 template variants allowed.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate default percentage for the new variant
    const totalTemplates = abTestSettings.templates.length + 1;
    const equalPercentage = Math.floor(100 / totalTemplates);
    
    // Adjust existing template percentages to make room for the new one
    const updatedTemplates = abTestSettings.templates.map(t => ({
      ...t,
      percentage: equalPercentage
    }));
    
    // Add the new template variant
    updatedTemplates.push({
      templateId: '',
      percentage: equalPercentage + (100 - (equalPercentage * totalTemplates)) // Remainder to make sum 100%
    });
    
    setAbTestSettings({
      ...abTestSettings,
      templates: updatedTemplates
    });
  };

  // Remove template variant from A/B test
  const removeTemplateVariant = (index: number) => {
    if (abTestSettings.templates.length <= 2) {
      toast({
        title: "Error",
        description: "A/B test requires at least 2 template variants.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTemplates = [...abTestSettings.templates];
    updatedTemplates.splice(index, 1);
    
    // Recalculate percentages to ensure they still add up to 100%
    const totalTemplates = updatedTemplates.length;
    const equalPercentage = Math.floor(100 / totalTemplates);
    
    const rebalancedTemplates = updatedTemplates.map((t, i) => ({
      ...t,
      percentage: i === totalTemplates - 1 
        ? equalPercentage + (100 - (equalPercentage * totalTemplates)) // Add remainder to the last one
        : equalPercentage
    }));
    
    setAbTestSettings({
      ...abTestSettings,
      templates: rebalancedTemplates
    });
  };

  // Filter templates
  const getFilteredTemplates = () => {
    // First apply search term filter
    let filtered = templates;
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(search) || 
        template.body.toLowerCase().includes(search)
      );
    }
    
    // Apply category filter if active
    if (activeFilter) {
      filtered = filtered.filter(template => 
        template.categoryIds?.includes(activeFilter)
      );
    }
    
    // Apply shared filter if active
    if (showShared) {
      filtered = filtered.filter(template => template.isPublic);
    }
    
    // Then apply tab filter if not on 'all' tab
    if (activeTab === 'uncategorized') {
      filtered = filtered.filter(template => 
        !template.categoryIds || template.categoryIds.length === 0
      );
    }
    
    return filtered;
  };

  // Get the color badge for a category
  const getCategoryColorClass = (color: string) => {
    const colorObj = availableColors.find(c => c.value === color) || availableColors[0];
    
    return {
      backgroundColor: colorObj.bg,
      color: colorObj.text,
      borderColor: colorObj.border
    };
  };

  // Get active campaigns for a template
  const getActiveCampaignsForTemplate = (templateId: string) => {
    return campaigns.filter(campaign => 
      campaign.templateId === templateId || 
      campaign.templateVariants?.some(v => v.templateId === templateId)
    );
  };

  // Render campaign badge with status color
  const renderCampaignBadge = (campaign: Campaign) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800 border-gray-300',
      'active': 'bg-green-100 text-green-800 border-green-300',
      'paused': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'completed': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    
    const color = statusColors[campaign.status] || statusColors.draft;
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs py-0 h-5 ${color}`}
      >
        {campaign.name}
      </Badge>
    );
  };

  // Available fields for display
  const availableFields = getAvailableContactFields();
  const filteredTemplates = getFilteredTemplates();

  // Get categories for a template
  const getTemplateCategoriesDisplay = (template: Template) => {
    if (!template.categoryIds || template.categoryIds.length === 0) {
      return null;
    }
    
    const templateCats = templateCategories.filter(cat => 
      template.categoryIds?.includes(cat.id)
    );
    
    if (templateCats.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {templateCats.map(category => (
          <Badge 
            key={category.id} 
            variant="outline" 
            className="text-xs py-0 h-5"
            style={getCategoryColorClass(category.color)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    );
  };

  // Get template stats for display
  const getTemplateStats = (template: Template) => {
    const stats = template.usageStats || { templateId: template.id, usageCount: 0, campaignIds: [] };
    return (
      <div className="flex items-center space-x-2 text-muted-foreground text-xs">
        <span title="Usage count">{stats.usageCount} uses</span>
        {stats.responseRate !== undefined && (
          <span title="Response rate">{Math.round(stats.responseRate * 100)}% responses</span>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6 flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Message Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable templates for your SMS campaigns with personalization variables.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Tag className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
              {activeFilter && (
                <TabsTrigger value="filtered">
                  {templateCategories.find(c => c.id === activeFilter)?.name || 'Filtered'}
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="shared"
                onClick={() => setShowShared(!showShared)}
                className={showShared ? "bg-primary/10" : ""}
              >
                Shared Templates
                {showShared && <Badge variant="secondary" className="ml-2">On</Badge>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 ml-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={activeFilter ? "bg-primary/10" : ""}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  {activeFilter && (
