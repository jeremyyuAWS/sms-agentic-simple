
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListFilter, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusFilterType = 'all' | 'active' | 'draft' | 'paused' | 'completed';

interface CampaignFiltersProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
  onSortChange?: (sortBy: string) => void;
  totalCount?: number;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  activeStatus,
  onStatusChange,
  onSortChange,
  totalCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <Tabs
        value={activeStatus}
        onValueChange={onStatusChange}
        className="w-full"
      >
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0">
            <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">All</span>
              <span className="sm:hidden">All</span>
              {totalCount !== undefined && <span className="ml-1 text-xs opacity-70">({totalCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="hidden sm:inline">Active</span>
              <span className="sm:hidden">Active</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="hidden sm:inline">Drafts</span>
              <span className="sm:hidden">Drafts</span>
            </TabsTrigger>
            <TabsTrigger value="paused" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              <span className="hidden sm:inline">Paused</span>
              <span className="sm:hidden">Paused</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-gray-400"></span>
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 whitespace-nowrap">
              <ListFilter className="h-3.5 w-3.5 mr-1.5" />
              <span>Sort & Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
              checked={true} 
              onCheckedChange={() => onSortChange?.('newest')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Newest First
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={false} 
              onCheckedChange={() => onSortChange?.('oldest')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Oldest First
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={false} 
              onCheckedChange={() => onSortChange?.('response')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Response Rate
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={false} 
              onCheckedChange={() => onSortChange?.('contacts')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Contact Count
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CampaignFilters;
