
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFollowUpDragDrop = (followUps: any[], onFollowUpsChange: (followUps: any[]) => void) => {
  const { toast } = useToast();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggingIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    
    if (isNaN(draggedIndex) || draggedIndex === index) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFollowUps = [...followUps];
    const draggedItem = newFollowUps[draggedIndex];
    
    // Remove the item from its original position
    newFollowUps.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newFollowUps.splice(index, 0, draggedItem);
    
    // Update delay days based on new positions
    newFollowUps.forEach((followUp, idx) => {
      if (idx === 0) {
        // First message is always sent immediately
        return;
      }
      // Adjust delay days based on position
      followUp.delayDays = idx * 3; // Simple formula: 3 days between messages
    });
    
    onFollowUpsChange(newFollowUps);
    setDraggingIndex(null);
    setDragOverIndex(null);
    
    toast({
      title: "Message Sequence Updated",
      description: "The message sequence has been reordered.",
    });
  };

  return {
    draggingIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  };
};
