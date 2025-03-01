
import { useToast } from '@/hooks/use-toast';

export const useFollowUpManagement = (
  followUps: any[], 
  onFollowUpsChange: (followUps: any[]) => void
) => {
  const { toast } = useToast();

  // Function to move a follow-up message up in the sequence
  const moveFollowUpUp = (index: number) => {
    if (index <= 0) return; // Can't move the first item up
    
    const newFollowUps = [...followUps];
    const temp = newFollowUps[index];
    newFollowUps[index] = newFollowUps[index - 1];
    newFollowUps[index - 1] = temp;
    
    // Adjust delay days to maintain relative spacing
    const currentDelay = newFollowUps[index].delayDays;
    const prevDelay = newFollowUps[index - 1].delayDays;
    newFollowUps[index].delayDays = prevDelay;
    newFollowUps[index - 1].delayDays = currentDelay;
    
    onFollowUpsChange(newFollowUps);
    
    toast({
      title: "Message Reordered",
      description: "Message moved up in the sequence.",
    });
  };

  // Function to move a follow-up message down in the sequence
  const moveFollowUpDown = (index: number) => {
    if (index >= followUps.length - 1) return; // Can't move the last item down
    
    const newFollowUps = [...followUps];
    const temp = newFollowUps[index];
    newFollowUps[index] = newFollowUps[index + 1];
    newFollowUps[index + 1] = temp;
    
    // Adjust delay days to maintain relative spacing
    const currentDelay = newFollowUps[index].delayDays;
    const nextDelay = newFollowUps[index + 1].delayDays;
    newFollowUps[index].delayDays = nextDelay;
    newFollowUps[index + 1].delayDays = currentDelay;
    
    onFollowUpsChange(newFollowUps);
    
    toast({
      title: "Message Reordered",
      description: "Message moved down in the sequence.",
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
    moveFollowUpUp,
    moveFollowUpDown,
    getMessageTitle
  };
};
