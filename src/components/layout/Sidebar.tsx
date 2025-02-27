
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  MessageSquare, 
  Settings, 
  Tag
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useApp();
  
  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Campaigns',
      icon: BarChart2,
      href: '/campaigns',
      active: location.pathname === '/campaigns',
    },
    {
      label: 'Contacts',
      icon: Users,
      href: '/contacts',
      active: location.pathname === '/contacts',
    },
    {
      label: 'Conversations',
      icon: MessageSquare,
      href: '/conversations',
      active: location.pathname === '/conversations',
    },
    {
      label: 'Templates',
      icon: Tag,
      href: '/templates',
      active: location.pathname === '/templates',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      active: location.pathname === '/settings',
    },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r",
      sidebarOpen ? "w-64" : "w-[70px]",
      className
    )}>
      <div className="py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className={cn(
            "text-lg font-semibold transition-all overflow-hidden",
            sidebarOpen ? "opacity-100 mb-6" : "opacity-0 h-0"
          )}>
            Text Campaigns
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  !sidebarOpen && 'justify-center',
                )}
                onClick={() => navigate(route.href)}
              >
                <route.icon className={cn(
                  'h-5 w-5',
                  sidebarOpen ? 'mr-3' : 'mr-0'
                )} />
                <span className={cn(
                  'transition-all overflow-hidden',
                  sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                )}>
                  {route.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
