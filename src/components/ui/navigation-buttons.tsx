
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
          className="flex items-center gap-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          onClick={() => navigate('/contacts')}
        >
          <Contact className="h-4 w-4" />
          Contacts & Knowledge Base
        </Button>
      )}
      
      {currentPage !== 'templates' && (
        <Button 
          size="lg"
          className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
          onClick={() => navigate('/templates')}
        >
          <File className="h-4 w-4" />
          Templates
        </Button>
      )}
      
      {currentPage !== 'campaigns' && (
        <Button 
          size="lg"
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
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
