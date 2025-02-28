
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Contact, File, MailCheck } from "lucide-react";

interface NavigationButtonsProps {
  currentPage: 'contacts' | 'templates' | 'campaigns';
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentPage }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-4 mt-16 mb-8">
      {currentPage !== 'contacts' && (
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
          onClick={() => navigate('/contacts')}
        >
          <Contact className="h-4 w-4" />
          Contacts & Knowledge Base
        </Button>
      )}
      
      {currentPage !== 'templates' && (
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
          onClick={() => navigate('/templates')}
        >
          <File className="h-4 w-4" />
          Templates
        </Button>
      )}
      
      {currentPage !== 'campaigns' && (
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
          onClick={() => navigate('/campaigns')}
        >
          <MailCheck className="h-4 w-4" />
          Campaigns
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
