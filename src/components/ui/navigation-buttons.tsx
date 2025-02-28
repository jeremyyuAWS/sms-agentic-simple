
import React from 'react';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { Home, Users, Send, FileCode, MessageSquare } from 'lucide-react';

interface NavigationButtonsProps {
  currentPage?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentPage }) => {
  const pages = [
    { name: 'home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'contacts', path: '/contacts', icon: <Users className="h-5 w-5" /> },
    { name: 'templates', path: '/templates', icon: <FileCode className="h-5 w-5" /> },
    { name: 'campaigns', path: '/campaigns', icon: <Send className="h-5 w-5" /> },
    { name: 'simplified-campaigns', path: '/simplified-campaigns', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-background/70 backdrop-blur-md border-t z-50">
      <div className="flex space-x-2">
        {pages.map((page) => (
          <Button
            key={page.name}
            variant={currentPage === page.name ? "default" : "outline"}
            size="icon"
            asChild
          >
            <Link to={page.path} aria-label={page.name}>
              {page.icon}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NavigationButtons;
