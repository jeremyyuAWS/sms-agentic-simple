
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Contact, ContactFilter, ContactSegment, ContactTag } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, X, Filter, Save, Tag, Users, Database, UserPlus, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactSelectorProps {
  selectedContactIds: string[];
  onSelectionChange: (contactIds: string[]) => void;
  segmentId?: string;
  onSegmentChange?: (segmentId: string) => void;
  customFilter?: ContactFilter;
  onFilterChange?: (filter: ContactFilter | undefined) => void;
}

const ContactSelector: React.FC<ContactSelectorProps> = ({
  selectedContactIds,
  onSelectionChange,
  segmentId,
  onSegmentChange,
  customFilter,
  onFilterChange
}) => {
  const { contacts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'segments' | 'selection'>('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<ContactFilter | undefined>(customFilter);
  const [selectMode, setSelectMode] = useState<'all' | 'segment' | 'filter' | 'manual'>(
    segmentId ? 'segment' : customFilter ? 'filter' : selectedContactIds.length > 0 ? 'manual' : 'all'
  );
  
  // Mock data for demo - in real app, these would come from the context
  const [tags] = useState<ContactTag[]>([
    { id: 'tag1', name: 'VIP', color: 'bg-red-500', count: 12 },
    { id: 'tag2', name: 'Conference', color: 'bg-blue-500', count: 24 },
    { id: 'tag3', name: 'Pending', color: 'bg-yellow-500', count: 8 },
    { id: 'tag4', name: 'Responded', color: 'bg-green-500', count: 15 },
  ]);
  
  const [segments] = useState<ContactSegment[]>([
    { 
      id: 'segment1', 
      name: 'Conference Attendees', 
      filter: { field: 'attendingConference', operator: 'equals', value: true },
      count: 24,
      createdAt: new Date()
    },
    { 
      id: 'segment2', 
      name: 'Tech Companies', 
      filter: { field: 'company', operator: 'in', value: ['Google', 'Microsoft', 'Apple', 'Meta'] },
      count: 18,
      createdAt: new Date()
    },
    { 
      id: 'segment3', 
      name: 'C-Level Executives', 
      filter: { 
        field: 'position', 
        operator: 'contains', 
        value: 'CEO',
        logic: 'or',
        children: [
          { field: 'position', operator: 'contains', value: 'CTO' },
          { field: 'position', operator: 'contains', value: 'CFO' },
          { field: 'position', operator: 'contains', value: 'COO' }
        ]
      },
      count: 7,
      createdAt: new Date()
    },
  ]);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      contact.phoneNumber.includes(searchTerm)
    );
  });
  
  // Apply the custom filter if one is set
  const applyFilter = (contacts: Contact[], filter?: ContactFilter): Contact[] => {
    if (!filter) return contacts;
    
    return contacts.filter(contact => {
      const evaluateFilter = (filter: ContactFilter): boolean => {
        const { field, operator, value } = filter;
        const contactValue = contact[field];
        
        switch (operator) {
          case 'equals':
            return contactValue === value;
          case 'contains':
            return String(contactValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(contactValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(contactValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'greaterThan':
            return contactValue > value;
          case 'lessThan':
            return contactValue < value;
          case 'in':
            return Array.isArray(value) && value.includes(contactValue);
          case 'notIn':
            return Array.isArray(value) && !value.includes(contactValue);
          case 'exists':
            return contactValue !== undefined && contactValue !== null;
          case 'notExists':
            return contactValue === undefined || contactValue === null;
          default:
            return true;
        }
      };
      
      const result = evaluateFilter(filter);
      
      // Handle nested children with logic
      if (filter.children && filter.children.length > 0) {
        const childResults = filter.children.map(child => evaluateFilter(child));
        
        if (filter.logic === 'or') {
          return result || childResults.some(r => r);
        } else { // 'and' is default
          return result && childResults.every(r => r);
        }
      }
      
      return result;
    });
  };
  
  // Get filtered contacts based on different criteria
  const getDisplayedContacts = (): Contact[] => {
    let displayedContacts = filteredContacts;
    
    if (selectMode === 'segment' && segmentId) {
      const segment = segments.find(s => s.id === segmentId);
      if (segment) {
        displayedContacts = applyFilter(displayedContacts, segment.filter);
      }
    } else if (selectMode === 'filter' && customFilter) {
      displayedContacts = applyFilter(displayedContacts, customFilter);
    }
    
    return displayedContacts;
  };
  
  const displayedContacts = getDisplayedContacts();
  
  // Toggle selection of a contact
  const toggleContactSelection = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      onSelectionChange(selectedContactIds.filter(id => id !== contactId));
    } else {
      onSelectionChange([...selectedContactIds, contactId]);
    }
  };
  
  // Select or deselect all displayed contacts
  const toggleSelectAll = () => {
    if (selectedContactIds.length === displayedContacts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(displayedContacts.map(contact => contact.id));
    }
  };
  
  // Handle selection mode change
  const handleSelectModeChange = (mode: 'all' | 'segment' | 'filter' | 'manual') => {
    setSelectMode(mode);
    
    if (mode === 'all') {
      onSelectionChange([]);
      if (onSegmentChange) onSegmentChange('');
      if (onFilterChange) onFilterChange(undefined);
    } else if (mode === 'segment' && segments.length > 0 && onSegmentChange) {
      onSegmentChange(segments[0].id);
      onSelectionChange([]);
      if (onFilterChange) onFilterChange(undefined);
    }
  };
  
  // Handle segment selection
  const handleSegmentSelect = (segmentId: string) => {
    if (onSegmentChange) {
      onSegmentChange(segmentId);
      setSelectMode('segment');
      
      // Clear other selection methods
      onSelectionChange([]);
      if (onFilterChange) onFilterChange(undefined);
    }
  };
  
  // Apply custom filter
  const applyCustomFilter = () => {
    if (onFilterChange && tempFilter) {
      onFilterChange(tempFilter);
      setSelectMode('filter');
      
      // Clear other selection methods
      onSelectionChange([]);
      if (onSegmentChange) onSegmentChange('');
    }
    setIsFilterDialogOpen(false);
  };
  
  // Create a new filter field
  const createFilterField = () => {
    const newFilter: ContactFilter = {
      field: 'name',
      operator: 'contains',
      value: ''
    };
    
    setTempFilter(newFilter);
  };
  
  // Reset the custom filter
  const resetFilter = () => {
    setTempFilter(undefined);
    if (onFilterChange) {
      onFilterChange(undefined);
    }
    setIsFilterDialogOpen(false);
  };
  
  // Handle filter changes
  const updateFilterField = (field: string) => {
    if (!tempFilter) return;
    setTempFilter({...tempFilter, field});
  };
  
  const updateFilterOperator = (operator: ContactFilter['operator']) => {
    if (!tempFilter) return;
    setTempFilter({...tempFilter, operator});
  };
  
  const updateFilterValue = (value: any) => {
    if (!tempFilter) return;
    setTempFilter({...tempFilter, value});
  };
  
  // Initialize the filter dialog
  const openFilterDialog = () => {
    setTempFilter(customFilter || {
      field: 'name',
      operator: 'contains',
      value: ''
    });
    setIsFilterDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Select 
            value={selectMode} 
            onValueChange={(value: 'all' | 'segment' | 'filter' | 'manual') => handleSelectModeChange(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selection method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All contacts</SelectItem>
              <SelectItem value="segment">Use segment</SelectItem>
              <SelectItem value="filter">Custom filter</SelectItem>
              <SelectItem value="manual">Manual selection</SelectItem>
            </SelectContent>
          </Select>
          
          {selectMode === 'segment' && (
            <Select 
              value={segmentId} 
              onValueChange={handleSegmentSelect}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map(segment => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name} ({segment.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {selectMode === 'filter' && (
            <div className="flex-1 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={openFilterDialog}
              >
                {customFilter ? 'Edit Filter' : 'Create Filter'}
                <Filter className="ml-2 h-4 w-4" />
              </Button>
              
              {customFilter && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={resetFilter}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {selectMode === 'manual' && (
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="px-2 py-1">
              {selectedContactIds.length} contacts selected
            </Badge>
            
            <div className="space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onSelectionChange([])}>
                Clear
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                {selectedContactIds.length === displayedContacts.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Tags
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-1">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center p-1 cursor-pointer hover:bg-muted rounded-md">
                    <div className={`w-3 h-3 rounded-full ${tag.color} mr-2`}></div>
                    <span className="flex-1">{tag.name}</span>
                    <Badge variant="outline" className="ml-auto">{tag.count}</Badge>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Create new tag
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="border rounded-md">
        {displayedContacts.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="p-1">
              {selectMode === 'manual' && (
                <div className="flex items-center p-2 bg-muted/50 sticky top-0 z-10">
                  <Checkbox 
                    id="selectAll"
                    checked={selectedContactIds.length === displayedContacts.length && displayedContacts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label htmlFor="selectAll" className="ml-2 cursor-pointer">Select all ({displayedContacts.length})</Label>
                </div>
              )}
              
              {displayedContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={cn(
                    "flex items-center p-3 hover:bg-muted/50 border-b last:border-0",
                    selectedContactIds.includes(contact.id) && selectMode === 'manual' && "bg-primary/5"
                  )}
                >
                  {selectMode === 'manual' && (
                    <Checkbox 
                      id={`contact-${contact.id}`}
                      checked={selectedContactIds.includes(contact.id)}
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                      className="mr-3"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex ml-2 gap-1">
                          {contact.tags.slice(0, 2).map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                              <div 
                                key={tag.id} 
                                className={`w-2 h-2 rounded-full ${tag.color}`}
                                title={tag.name}
                              ></div>
                            ) : null;
                          })}
                          {(contact.tags?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              +{(contact.tags?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className="truncate">{contact.company || "No company"}</span>
                      <span className="truncate">{contact.position || "No position"}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-right">
                    <p>{contact.phoneNumber}</p>
                    <p className="text-muted-foreground">{contact.email || "No email"}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] p-4 text-center">
            <Users className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium">No contacts found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'Import contacts to get started'}
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Filter</DialogTitle>
            <DialogDescription>
              Filter contacts based on specific criteria.
            </DialogDescription>
          </DialogHeader>
          
          {!tempFilter ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Filter className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">No filter defined</h3>
              <Button className="mt-4" onClick={createFilterField}>
                <Plus className="mr-2 h-4 w-4" />
                Create Filter
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <div className="w-1/3">
                  <Label htmlFor="filterField">Field</Label>
                  <Select 
                    value={tempFilter.field} 
                    onValueChange={updateFilterField}
                  >
                    <SelectTrigger id="filterField">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phoneNumber">Phone Number</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="position">Position</SelectItem>
                      <SelectItem value="attendingConference">Attending Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/3">
                  <Label htmlFor="filterOperator">Operator</Label>
                  <Select 
                    value={tempFilter.operator} 
                    onValueChange={(value: ContactFilter['operator']) => updateFilterOperator(value)}
                  >
                    <SelectTrigger id="filterOperator">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="startsWith">Starts with</SelectItem>
                      <SelectItem value="endsWith">Ends with</SelectItem>
                      {tempFilter.field === 'attendingConference' && (
                        <SelectItem value="equals">Equals</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/3">
                  <Label htmlFor="filterValue">Value</Label>
                  {tempFilter.field === 'attendingConference' ? (
                    <Select 
                      value={String(tempFilter.value)} 
                      onValueChange={(value) => updateFilterValue(value === 'true')}
                    >
                      <SelectTrigger id="filterValue">
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="filterValue"
                      value={tempFilter.value || ''}
                      onChange={(e) => updateFilterValue(e.target.value)}
                      placeholder="Enter value"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyCustomFilter} disabled={!tempFilter || !tempFilter.value}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="text-sm text-muted-foreground">
        {selectMode === 'all' && (
          <p>{contacts.length} total contacts available</p>
        )}
        
        {selectMode === 'segment' && segmentId && (
          <p>Using segment: {segments.find(s => s.id === segmentId)?.name} ({displayedContacts.length} contacts)</p>
        )}
        
        {selectMode === 'filter' && customFilter && (
          <p>Using custom filter ({displayedContacts.length} contacts)</p>
        )}
        
        {selectMode === 'manual' && (
          <p>{selectedContactIds.length} of {displayedContacts.length} contacts selected</p>
        )}
      </div>
    </div>
  );
};

export default ContactSelector;
