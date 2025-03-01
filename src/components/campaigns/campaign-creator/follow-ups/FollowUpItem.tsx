
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, GripVertical, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FollowUpItemProps {
  followUp: any;
  index: number;
  totalCount: number;
  draggingIndex: number | null;
  dragOverIndex: number | null;
  getMessageTitle: (index: number, followUp: any) => string;
  moveFollowUpUp: (index: number) => void;
  moveFollowUpDown: (index: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({
  followUp,
  index,
  totalCount,
  draggingIndex,
  dragOverIndex,
  getMessageTitle,
  moveFollowUpUp,
  moveFollowUpDown,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
}) => {
  return (
    <div 
      key={followUp.id} 
      className={`relative bg-slate-50 border rounded-lg p-4 shadow-sm ${
        draggingIndex === index ? 'border-primary border-2' : ''
      } ${dragOverIndex === index ? 'border-dashed border-primary border-2' : ''}`}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, index)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-medium">
            {index + 1}
          </div>
          <span 
            className="cursor-grab px-1 text-gray-400 hover:text-gray-600" 
            onMouseDown={(e) => e.currentTarget.parentElement?.parentElement?.parentElement?.setAttribute('draggable', 'true')}
            onMouseUp={(e) => e.currentTarget.parentElement?.parentElement?.parentElement?.setAttribute('draggable', 'false')}
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <h4 className="font-medium">
            {getMessageTitle(index, followUp)}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => moveFollowUpUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move message up in sequence</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => moveFollowUpDown(index)}
                  disabled={index === totalCount - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move message down in sequence</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="mr-1 h-4 w-4" />
          {index === 0 ? 
            'Initial message sent immediately' : 
            `Sent ${followUp.delayDays} days after initial message`}
        </div>
      </div>
    </div>
  );
};

export default FollowUpItem;
