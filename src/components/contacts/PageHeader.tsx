
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onCreateList: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onCreateList }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1 text-left">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your contacts and contact lists
        </p>
      </div>
      
      <Button onClick={onCreateList} className="bg-[#8B5CF6] hover:bg-[#7E69AB]">
        <Plus className="mr-2 h-4 w-4" />
        New List
      </Button>
    </div>
  );
};

export default PageHeader;
