
import React from 'react';
import { Filter, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/lib/types';

interface ContactFiltersProps {
  selectedSourceFilter: string;
  searchQuery: string;
  sortedGroups: [string, Contact[]][];
  getSourceCount: (sourceKey: string) => number;
  onSourceFilterChange: (sourceKey: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSelectAllToggle: () => void;
  filteredContacts: Contact[];
  selectedContactIds: string[];
  resetFilters: () => void;
}

const ContactFilters: React.FC<ContactFiltersProps> = ({
  selectedSourceFilter,
  searchQuery,
  sortedGroups,
  getSourceCount,
  onSourceFilterChange,
  onSearchQueryChange,
  onSelectAllToggle,
  filteredContacts,
  selectedContactIds,
  resetFilters
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>Select Contacts for this List</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="w-full sm:w-[220px]">
            <Select
              value={selectedSourceFilter}
              onValueChange={onSourceFilterChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts ({getSourceCount('all')})</SelectItem>
                {sortedGroups.map(([groupName]) => (
                  <SelectItem key={groupName} value={groupName}>
                    {groupName} ({getSourceCount(groupName)})
                  </SelectItem>
                ))}
                {getSourceCount('untracked') > 0 && (
                  <SelectItem value="untracked">Untracked ({getSourceCount('untracked')})</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-[250px] relative">
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full"
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                onClick={() => onSearchQueryChange('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSelectAllToggle}
            className="whitespace-nowrap"
          >
            {selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
      </div>
      
      {(selectedSourceFilter !== 'all' || searchQuery) && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/40 rounded-md">
          <div className="text-xs text-muted-foreground flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Filters:
          </div>
          
          {selectedSourceFilter !== 'all' && (
            <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
              Source: {selectedSourceFilter}
              <button 
                onClick={() => onSourceFilterChange('all')}
                className="ml-1 rounded-full hover:bg-primary/10 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
              Search: {searchQuery}
              <button 
                onClick={() => onSearchQueryChange('')}
                className="ml-1 rounded-full hover:bg-primary/10 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <button 
            onClick={resetFilters}
            className="text-xs text-primary hover:underline ml-auto"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
};

export default ContactFilters;
