
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, Users, MessageSquare, Settings, Tag, Send, MessageCircle } from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export function Sidebar({ className, ...props }: React.ComponentProps<'div'>) {
  const { sidebarOpen, toggleSidebar } = useApp();

  const items = [
    {
      href: '/',
      title: 'Dashboard',
      icon: Home,
    },
    {
      href: '/contacts',
      title: 'Contacts',
      icon: Users,
    },
    {
      href: '/templates',
      title: 'Templates',
      icon: MessageSquare,
    },
    {
      href: '/campaigns',
      title: 'Campaigns',
      icon: Send,
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background h-screen',
        sidebarOpen ? 'w-[240px]' : 'w-[70px]',
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute right-2 top-2"
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform',
            !sidebarOpen && 'rotate-180'
          )}
        />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div
        className={cn(
          'flex h-14 items-center border-b px-4',
          sidebarOpen ? 'justify-start' : 'justify-center'
        )}
      >
        <MessageCircle className="h-6 w-6 text-primary" />
        {sidebarOpen && (
          <span className="ml-2 text-lg font-semibold tracking-tight">
            Taikis
          </span>
        )}
      </div>
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarNav items={items} />
          </div>
        </div>
        <div className="mt-auto px-3 py-2">
          <div className="space-y-1">
            <NavLink
              to="/settings"
              className={(props) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  props.isActive
                    ? 'text-primary-foreground bg-primary'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted',
                  !sidebarOpen && 'justify-center'
                )
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              {sidebarOpen && <span>Settings</span>}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { sidebarOpen } = useApp();

  return (
    <nav className={cn('grid gap-1', className)} {...props}>
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.href}
          className={(navProps) =>
            cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              navProps.isActive
                ? 'text-primary-foreground bg-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-muted',
              !sidebarOpen && 'justify-center'
            )
          }
        >
          <item.icon className={cn('h-4 w-4', sidebarOpen && 'mr-2')} />
          {sidebarOpen && <span>{item.title}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
