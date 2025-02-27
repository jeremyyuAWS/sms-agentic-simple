
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Bell, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search..." 
          className="pl-10 h-9 w-full bg-muted/50"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary rounded-full" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium">Alex Johnson</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
