
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { 
  Home, 
  MessageSquare, 
  Send, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useApp();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
    { icon: Send, label: 'Campaigns', path: '/campaigns' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className={cn(
      'h-screen border-r border-border/50 bg-card transition-all duration-300 ease-in-out flex flex-col z-30',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-border/50">
        <div className={cn(
          'font-semibold text-xl flex items-center gap-2 transition-all duration-300 overflow-hidden',
          !sidebarOpen && 'opacity-0'
        )}>
          <span className="text-primary">SMS</span>
          <span>Agent</span>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-muted/80 transition-colors duration-300"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300',
              isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/80',
              !sidebarOpen && 'justify-center'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className={cn(
              'transition-all duration-300',
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            )}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      <div className={cn(
        'p-4 border-t border-border/50 transition-all duration-300',
        sidebarOpen ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="text-xs text-muted-foreground">
          © 2023 SMS Agent
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
