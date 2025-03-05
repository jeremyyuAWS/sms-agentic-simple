
import React from 'react';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { Home, Users, Send, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavigationButtonsProps {
  currentPage?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentPage }) => {
  const pages = [
    { name: 'home', path: '/', icon: <Home className="h-5 w-5" />, label: 'Home' },
    { name: 'simplified-campaigns', path: '/simplified-campaigns', icon: <MessageSquare className="h-5 w-5" />, label: 'SMS Campaigns' },
    { name: 'contacts', path: '/contacts', icon: <Users className="h-5 w-5" />, label: 'Contacts' },
    { name: 'campaigns', path: '/campaigns', icon: <Send className="h-5 w-5" />, label: 'Campaigns' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-background/70 backdrop-blur-md border-t z-50">
      <div className="flex space-x-2">
        <TooltipProvider>
          {pages.map((page) => (
            <Tooltip key={page.name}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentPage === page.name ? "default" : "outline"}
                  size="icon"
                  asChild
                >
                  <Link to={page.path} aria-label={page.label}>
                    {page.icon}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{page.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NavigationButtons;
