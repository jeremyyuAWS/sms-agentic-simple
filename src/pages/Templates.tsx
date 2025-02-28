
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
        templateId: t.templateId,
        name: templates.find(template => template.id === t.templateId)?.name || '',
        contactPercentage: t.percentage
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
                    <Badge variant="secondary" className="ml-2">1</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Category</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {templateCategories.map(category => (
                      <div 
                        key={category.id} 
                        className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-md p-1"
                        onClick={() => toggleCategoryFilter(category.id)}
                      >
                        {activeFilter === category.id ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{category.name}</span>
                        <Badge 
                          variant="outline" 
                          className="ml-auto text-xs py-0 h-5"
                          style={getCategoryColorClass(category.color)}
                        >
                          {templates.filter(t => t.categoryIds?.includes(category.id)).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {(activeFilter || showShared) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={resetFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="relative">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full p-3 bg-primary/10 mb-4">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first message template to start building campaigns with personalized messaging.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full p-3 bg-primary/10 mb-4">
              <Filter className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Matching Templates</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              No templates found with the current filters. Try adjusting your search or filters.
            </p>
            <Button onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 mb-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                    {getTemplateCategoriesDisplay(template)}
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(template.body)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy template</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit template</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5 text-sm font-semibold">Assign Categories</div>
                        {templateCategories.map(category => (
                          <DropdownMenuItem 
                            key={category.id}
                            onSelect={(e) => {
                              e.preventDefault();
                              toggleTemplateCategory(template, category.id);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Checkbox 
                              id={`cat-${category.id}-${template.id}`}
                              checked={template.categoryIds?.includes(category.id)}
                              onCheckedChange={() => toggleTemplateCategory(template, category.id)}
                            />
                            <Label htmlFor={`cat-${category.id}-${template.id}`} className="flex-1 cursor-pointer">
                              {category.name}
                            </Label>
                            <div 
                              className="text-xs py-0 h-5 px-2 rounded border flex items-center"
                              style={getCategoryColorClass(category.color)}
                            >
                              {templates.filter(t => t.categoryIds?.includes(category.id)).length}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setTemplateToDelete(template)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteTemplate}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete template</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg text-sm mb-4">
                  {contacts.length > 0 ? (
                    <>
                      {generatePreview(template.body)}
                      <p className="text-xs text-muted-foreground mt-2">
                        Preview shows data from {contacts[0].name} ({contacts[0].company || "No company"})
                      </p>
                    </>
                  ) : (
                    template.body
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {template.variables.map(variable => (
                    <Badge key={variable} variant="outline" className="bg-primary/5">
                      <Tag className="h-3 w-3 mr-1" />
                      {variable}
                    </Badge>
                  ))}
                </div>

                {/* Campaign integration - Show campaigns that use this template */}
                {getActiveCampaignsForTemplate(template.id).length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Used in campaigns:</h4>
                    <div className="flex flex-wrap gap-2">
                      {getActiveCampaignsForTemplate(template.id).map(campaign => (
                        <TooltipProvider key={campaign.id}>
                          <Tooltip>
                            <TooltipTrigger>
                              {renderCampaignBadge(campaign)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <p className="font-medium">{campaign.name}</p>
                                <p>Status: {campaign.status}</p>
                                {campaign.isABTest && <p>A/B Test</p>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <CardFooter className="bg-muted/30 p-4 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {getTemplateStats(template)}
                </div>
                <div className="flex gap-2">
                  {/* Campaign Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BarChart className="h-4 w-4 mr-2" />
                        Campaigns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleOpenCampaignIntegration(template)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenABTest(template)}>
                        <Split className="h-4 w-4 mr-2" />
                        Create A/B Test
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {getActiveCampaignsForTemplate(template.id).length > 0 
                          ? `Used in ${getActiveCampaignsForTemplate(template.id).length} campaign(s)` 
                          : 'Not used in any campaigns yet'}
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Additional Template Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreview(template)}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleOpenSharing(template)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Template
                      </DropdownMenuItem>
                      {template.isPublic && (
                        <DropdownMenuItem onClick={() => handleUnshareTemplate(template.id)}>
                          <Lock className="mr-2 h-4 w-4" />
                          Disable Sharing
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable message template with personalization variables using {"{variable}"} syntax.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name" 
                value={newTemplate.name} 
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})} 
                placeholder="e.g., Initial Outreach"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categories (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                {templateCategories.map(category => (
                  <Badge 
                    key={category.id} 
                    variant={newTemplate.categoryIds.includes(category.id) ? "default" : "outline"}
                    className={newTemplate.categoryIds.includes(category.id) ? "" : "cursor-pointer hover:bg-primary/20"}
                    style={newTemplate.categoryIds.includes(category.id) ? undefined : getCategoryColorClass(category.color)}
                    onClick={() => {
                      if (newTemplate.categoryIds.includes(category.id)) {
                        setNewTemplate({
                          ...newTemplate,
                          categoryIds: newTemplate.categoryIds.filter(id => id !== category.id)
                        });
                      } else {
                        setNewTemplate({
                          ...newTemplate,
                          categoryIds: [...newTemplate.categoryIds, category.id]
                        });
                      }
                    }}
                  >
                    {category.name}
                    {newTemplate.categoryIds.includes(category.id) && (
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    )}
                  </Badge>
                ))}
                {templateCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories created yet. You can create categories to organize your templates.
                  </p>
                )}
              </div>
            </div>
            
            {/* Available Contact Fields */}
            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <Label className="text-sm font-medium">Available Contact Fields</Label>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                Click a field to insert it into your template. Use format {"{field_name}"}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-1 text-muted-foreground">Standard Fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableFields.standard.map((field) => (
                      <TooltipProvider key={field.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs bg-background"
                              onClick={() => insertVariable(field.name, "body")}
                            >
                              <span className="truncate">{field.name}</span>
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
                
                {availableFields.custom.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">Custom Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableFields.custom.map((field) => (
                        <TooltipProvider key={field.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs bg-background"
                                onClick={() => insertVariable(field.name, "body")}
                              >
                                <span className="truncate">{field.name}</span>
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
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Template Body</Label>
              <Textarea 
                id="body" 
                value={newTemplate.body} 
                onChange={handleBodyChange} 
                placeholder="Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
                rows={6}
                required
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{variable}"} syntax for personalization (e.g., {"{name}"}, {"{company}"})
              </p>
            </div>
            
            {extractedVariables.length > 0 && (
              <div className="space-y-2">
                <Label>Detected Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedVariables.map(variable => (
                    <Badge key={variable} variant="outline" className="bg-primary/5">
                      <Tag className="h-3 w-3 mr-1" />
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-muted/30 text-sm">
                {contacts.length > 0 ? (
                  generatePreview(newTemplate.body)
                ) : (
                  newTemplate.body.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`)
                )}
              </div>
              {contacts.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Preview shows data from {contacts[0].name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your message template with personalization variables using {"{variable}"} syntax.
            </DialogDescription>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingTemplate.name} 
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})} 
                  placeholder="e.g., Initial Outreach"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categories (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {templateCategories.map(category => (
                    <Badge 
                      key={category.id} 
                      variant={editingTemplate.categoryIds?.includes(category.id) ? "default" : "outline"}
                      className={editingTemplate.categoryIds?.includes(category.id) ? "" : "cursor-pointer hover:bg-primary/20"}
                      style={editingTemplate.categoryIds?.includes(category.id) ? undefined : getCategoryColorClass(category.color)}
                      onClick={() => {
                        if (editingTemplate.categoryIds?.includes(category.id)) {
                          setEditingTemplate({
                            ...editingTemplate,
                            categoryIds: editingTemplate.categoryIds.filter(id => id !== category.id)
                          });
                        } else {
                          setEditingTemplate({
                            ...editingTemplate,
                            categoryIds: [...(editingTemplate.categoryIds || []), category.id]
                          });
                        }
                      }}
                    >
                      {category.name}
                      {editingTemplate.categoryIds?.includes(category.id) && (
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Available Contact Fields */}
              <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm font-medium">Available Contact Fields</Label>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  Click a field to insert it into your template. Use format {"{field_name}"}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">Standard Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableFields.standard.map((field) => (
                        <TooltipProvider key={field.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs bg-background"
                                onClick={() => insertVariable(field.name, "edit-body")}
                              >
                                <span className="truncate">{field.name}</span>
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
                  
                  {availableFields.custom.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1 text-muted-foreground">Custom Fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableFields.custom.map((field) => (
                          <TooltipProvider key={field.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs bg-background"
                                  onClick={() => insertVariable(field.name, "edit-body")}
                                >
                                  <span className="truncate">{field.name}</span>
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
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-body">Template Body</Label>
                <Textarea 
                  id="edit-body" 
                  value={editingTemplate.body} 
                  onChange={handleEditBodyChange} 
                  placeholder="Hi {name}, I'm Alex from Taikis. Do you have 5 minutes to discuss our opportunity?"
                  rows={6}
                  required
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{variable}"} syntax for personalization (e.g., {"{name}"}, {"{company}"})
                </p>
              </div>
              
              {editingTemplate.variables.length > 0 && (
                <div className="space-y-2">
                  <Label>Detected Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {editingTemplate.variables.map(variable => (
                      <Badge key={variable} variant="outline" className="bg-primary/5">
                        <Tag className="h-3 w-3 mr-1" />
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 border rounded-lg bg-muted/30 text-sm">
                  {contacts.length > 0 ? (
                    generatePreview(editingTemplate.body)
                  ) : (
                    editingTemplate.body.replace(/{([^}]+)}/g, (_, variable) => `[${variable}]`)
                  )}
                </div>
                {contacts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preview shows data from {contacts[0].name}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Preview how your template will look with different variable values.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <Label>Variables</Label>
                {selectedTemplate.variables.map(variable => (
                  <div key={variable} className="space-y-2">
                    <Label htmlFor={`var-${variable}`}>{variable}</Label>
                    <Input 
                      id={`var-${variable}`} 
                      value={previewData[variable] || ''} 
                      onChange={(e) => handlePreviewDataChange(variable, e.target.value)} 
                      placeholder={`Enter value for ${variable}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 border rounded-lg bg-muted/30 text-sm">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => copyToClipboard(renderPreview())}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Template Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your templates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input 
                id="category-name" 
                value={newCategory.name} 
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} 
                placeholder="e.g., Outreach, Follow-up"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-color">Color</Label>
              <Select 
                value={newCategory.color} 
                onValueChange={(value) => setNewCategory({...newCategory, color: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color">
                    <div className="flex items-center">
                      {newCategory.color && (
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{backgroundColor: availableColors.find(c => c.value === newCategory.color)?.text}}
                        />
                      )}
                      {availableColors.find(c => c.value === newCategory.color)?.name || "Select a color"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{backgroundColor: color.text}}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-description">Description (Optional)</Label>
              <Textarea 
                id="category-description" 
                value={newCategory.description} 
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} 
                placeholder="Briefly describe this category"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Sharing Dialog */}
      <Dialog open={isSharingOpen} onOpenChange={setIsSharingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Template</DialogTitle>
            <DialogDescription>
              Make this template available to other users or publicly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <Label htmlFor="public-sharing" className="text-base">Public Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Make this template available to everyone
                </p>
              </div>
              <Switch 
                id="public-sharing" 
                checked={sharingOptions.isPublic}
                onCheckedChange={(checked) => setSharingOptions({...sharingOptions, isPublic: checked})}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base">Share with specific users</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select users to share this template with
                </p>
              </div>
              
              <div className="border rounded-md">
                {mockUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Checkbox 
                      id={`user-${user.id}`}
                      checked={sharingOptions.userIds.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSharingOptions({
                            ...sharingOptions,
                            userIds: [...sharingOptions.userIds, user.id]
                          });
                        } else {
                          setSharingOptions({
                            ...sharingOptions,
                            userIds: sharingOptions.userIds.filter(id => id !== user.id)
                          });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSharingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareTemplate}>
              {sharingOptions.isPublic ? (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Share Publicly
                </>
              ) : sharingOptions.userIds.length > 0 ? (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with {sharingOptions.userIds.length} User{sharingOptions.userIds.length !== 1 ? 's' : ''}
                </>
              ) : (
                "Share"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* A/B Test Creation Dialog */}
      <Dialog open={isABTestDialogOpen} onOpenChange={setIsABTestDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Create A/B Test Campaign</DialogTitle>
            <DialogDescription>
              Test different template variations to see which performs better.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input 
                id="campaign-name" 
                value={abTestSettings.name} 
                onChange={(e) => setAbTestSettings({...abTestSettings, name: e.target.value})} 
                placeholder="e.g., Q2 Outreach A/B Test"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description (Optional)</Label>
              <Textarea 
                id="campaign-description" 
                value={abTestSettings.description} 
                onChange={(e) => setAbTestSettings({...abTestSettings, description: e.target.value})} 
                placeholder="Briefly describe the purpose of this A/B test"
                rows={2}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Template Variants</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addTemplateVariant}
                  disabled={abTestSettings.templates.length >= 5}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
              
              <div className="space-y-4">
                {abTestSettings.templates.map((template, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      {index > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeTemplateVariant(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`template-${index}`}>Template</Label>
                        <Select 
                          value={template.templateId} 
                          onValueChange={(value) => {
                            const updatedTemplates = [...abTestSettings.templates];
                            updatedTemplates[index].templateId = value;
                            setAbTestSettings({
                              ...abTestSettings,
                              templates: updatedTemplates
                            });
                          }}
                        >
                          <SelectTrigger id={`template-${index}`}>
                            <SelectValue placeholder="Select a template">
                              {template.templateId 
                                ? templates.find(t => t.id === template.templateId)?.name 
                                : "Select a template"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(t => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`percentage-${index}`}>
                            Contact Percentage ({template.percentage}%)
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(template.percentage)}%
                          </span>
                        </div>
                        <Input 
                          id={`percentage-${index}`}
                          type="range"
                          min="5"
                          max="95"
                          value={template.percentage}
                          onChange={(e) => {
                            const newPercentage = parseInt(e.target.value);
                            
                            // Calculate remaining percentage
                            const otherTemplatesCount = abTestSettings.templates.length - 1;
                            const remainingPercentage = 100 - newPercentage;
                            const percentagePerTemplate = Math.floor(remainingPercentage / otherTemplatesCount);
                            
                            // Update all templates with new percentages
                            const updatedTemplates = abTestSettings.templates.map((t, i) => {
                              if (i === index) {
                                return { ...t, percentage: newPercentage };
                              } else {
                                return { ...t, percentage: percentagePerTemplate };
                              }
                            });
                            
                            // If there's a remainder, add it to the last template that's not the current one
                            const remainder = remainingPercentage - (percentagePerTemplate * otherTemplatesCount);
                            if (remainder > 0) {
                              const lastIndex = updatedTemplates.length - 1 === index ? index - 1 : updatedTemplates.length - 1;
                              if (lastIndex >= 0) {
                                updatedTemplates[lastIndex].percentage += remainder;
                              }
                            }
                            
                            setAbTestSettings({
                              ...abTestSettings,
                              templates: updatedTemplates
                            });
                          }}
                          className="w-full"
                        />
                      </div>
                      
                      {template.templateId && (
                        <div className="p-3 bg-muted/30 rounded-md text-sm mt-2">
                          <p className="font-medium mb-1">Preview:</p>
                          <div className="text-xs line-clamp-2">
                            {templates.find(t => t.id === template.templateId)?.body.substring(0, 150)}
                            {(templates.find(t => t.id === template.templateId)?.body.length || 0) > 150 ? "..." : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-duration">Test Duration (hours)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="test-duration"
                    type="number"
                    min={1}
                    max={168} // 1 week
                    value={abTestSettings.testDuration}
                    onChange={(e) => setAbTestSettings({
                      ...abTestSettings,
                      testDuration: parseInt(e.target.value) || 24
                    })}
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-muted-foreground">
                    = {Math.floor(abTestSettings.testDuration / 24)} day{abTestSettings.testDuration >= 48 ? 's' : ''} and {abTestSettings.testDuration % 24} hour{abTestSettings.testDuration % 24 !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="winner-criteria">Winner Selection Criteria</Label>
                <Select 
                  value={abTestSettings.winnerCriteria} 
                  onValueChange={(value) => setAbTestSettings({
                    ...abTestSettings,
                    winnerCriteria: value as typeof abTestSettings.winnerCriteria
                  })}
                >
                  <SelectTrigger id="winner-criteria">
                    <SelectValue placeholder="How to select the winner">
                      {abTestSettings.winnerCriteria === 'response-rate' && "Highest Response Rate"}
                      {abTestSettings.winnerCriteria === 'positive-response-rate' && "Highest Positive Response Rate"}
                      {abTestSettings.winnerCriteria === 'manual' && "Manual Selection"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="response-rate">Highest Response Rate</SelectItem>
                    <SelectItem value="positive-response-rate">Highest Positive Response Rate</SelectItem>
                    <SelectItem value="manual">Manual Selection</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {abTestSettings.winnerCriteria === 'response-rate' && 
                    "The template with the highest percentage of contacts who respond will be selected automatically."}
                  {abTestSettings.winnerCriteria === 'positive-response-rate' && 
                    "The template with the highest percentage of contacts who respond positively will be selected automatically."}
                  {abTestSettings.winnerCriteria === 'manual' && 
                    "You'll need to select the winning template manually after reviewing the results."}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 z-10">
            <Button variant="outline" onClick={() => setIsABTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateABTest}>
              <Split className="mr-2 h-4 w-4" />
              Create A/B Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Integration Dialog */}
      <Dialog open={isCampaignIntegrationOpen} onOpenChange={setIsCampaignIntegrationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Campaign</DialogTitle>
            <DialogDescription>
              Use this template in a campaign or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-action">Action</Label>
              <Select 
                value={campaignIntegration.action}
                onValueChange={(value) => setCampaignIntegration({
                  ...campaignIntegration,
                  action: value as typeof campaignIntegration.action
                })}
              >
                <SelectTrigger id="campaign-action">
                  <SelectValue placeholder="Select an action">
                    {campaignIntegration.action === 'create-campaign' && "Create new campaign"}
                    {campaignIntegration.action === 'add-to-existing' && "Add to existing campaign"}
                    {campaignIntegration.action === 'create-ab-test' && "Create A/B test"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create-campaign">Create new campaign</SelectItem>
                  <SelectItem value="add-to-existing">Add to existing campaign</SelectItem>
                  <SelectItem value="create-ab-test">Create A/B test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {campaignIntegration.action === 'add-to-existing' && (
              <div className="space-y-2">
                <Label htmlFor="existing-campaign">Select Campaign</Label>
                <Select 
                  value={campaignIntegration.campaignId}
                  onValueChange={(value) => setCampaignIntegration({
                    ...campaignIntegration,
                    campaignId: value
                  })}
                >
                  <SelectTrigger id="existing-campaign">
                    <SelectValue placeholder="Select a campaign">
                      {campaignIntegration.campaignId
                        ? campaigns.find(c => c.id === campaignIntegration.campaignId)?.name
                        : "Select a campaign"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns
                      .filter(c => c.status !== 'completed')
                      .map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name} ({campaign.status})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="rounded-md bg-muted p-4 text-sm">
              {campaignIntegration.action === 'create-campaign' && (
                <div className="flex">
                  <FileText className="h-10 w-10 text-primary/60 mr-3" />
                  <div>
                    <p className="font-medium">Create a new campaign with this template</p>
                    <p className="text-muted-foreground mt-1">
                      This will create a new draft campaign using this template as the primary message.
                      You'll be redirected to the campaign setup to configure other settings.
                    </p>
                  </div>
                </div>
              )}
              
              {campaignIntegration.action === 'add-to-existing' && (
                <div className="flex">
                  <ArrowUpRight className="h-10 w-10 text-primary/60 mr-3" />
                  <div>
                    <p className="font-medium">Add this template to an existing campaign</p>
                    <p className="text-muted-foreground mt-1">
                      This will associate the template with the selected campaign for reporting and tracking purposes.
                      To actually use the template, you'll need to update the campaign settings.
                    </p>
                  </div>
                </div>
              )}
              
              {campaignIntegration.action === 'create-ab-test' && (
                <div className="flex">
                  <Split className="h-10 w-10 text-primary/60 mr-3" />
                  <div>
                    <p className="font-medium">Create an A/B test with this template</p>
                    <p className="text-muted-foreground mt-1">
                      This will open the A/B test creation flow where you can select multiple template variants
                      to test against each other.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCampaignIntegrationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCampaignIntegration}>
              {campaignIntegration.action === 'create-campaign' && (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Campaign
                </>
              )}
              {campaignIntegration.action === 'add-to-existing' && (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Add to Campaign
                </>
              )}
              {campaignIntegration.action === 'create-ab-test' && (
                <>
                  <Split className="mr-2 h-4 w-4" />
                  Create A/B Test
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
