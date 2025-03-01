
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, MessageSquare, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageExamplesProps {
  examples: string[];
  onSelectExample: (message: string) => void;
  onOpenEditor: () => void;
}

const MessageExamples: React.FC<MessageExamplesProps> = ({ examples, onSelectExample, onOpenEditor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <MessageSquare className="h-4 w-4 mr-2" />
          View message examples
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="start">
        <div className="p-3 bg-slate-50 border-b">
          <p className="text-sm font-medium">Example Messages</p>
          <p className="text-xs text-muted-foreground">Select a message to use as a template</p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {examples.map((message, idx) => (
            <DropdownMenuItem 
              key={idx} 
              className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex flex-col items-start"
              onClick={() => {
                onOpenEditor();
                onSelectExample(message);
              }}
            >
              <p className="text-sm text-slate-800 mb-1 w-full">{message}</p>
              <div className="flex items-center text-xs text-primary w-full">
                <Copy className="h-3 w-3 mr-1" />
                Use this message
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageExamples;
