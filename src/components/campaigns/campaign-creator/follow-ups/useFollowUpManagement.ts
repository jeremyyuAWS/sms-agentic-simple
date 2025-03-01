
import { useToast } from '@/hooks/use-toast';

export const useFollowUpManagement = (
  followUps: any[], 
  onFollowUpsChange: (followUps: any[]) => void
) => {
  const { toast } = useToast();

  // Function to update a specific follow-up with new values
  const updateFollowUp = (index: number, updates: Partial<any>) => {
    if (index < 0 || index >= followUps.length) return;
    
    const newFollowUps = [...followUps];
    newFollowUps[index] = {
      ...newFollowUps[index],
      ...updates
    };
    
    onFollowUpsChange(newFollowUps);
    
    toast({
      title: "Message Updated",
      description: "Follow-up message has been updated.",
    });
  };

  // Get the message title based on index and custom name
  const getMessageTitle = (index: number, followUp: any) => {
    if (index === 0) {
      return 'Initial Message';
    }
    
    // Use custom name if available, otherwise use a generic name
    if (followUp.name) {
      return followUp.name;
    }
    
    return `Follow-up #${index}`;
  };

  return {
    updateFollowUp,
    getMessageTitle
  };
};
