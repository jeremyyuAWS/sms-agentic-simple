
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Edit, Plus, X } from 'lucide-react';
import MessageView from './components/MessageView';
import MessageContent from './components/MessageContent';
import MessageTiming from './components/MessageTiming';
import SuggestedTitles, { TitleSuggestion } from './components/SuggestedTitles';
import AITitleSuggestions from './components/AITitleSuggestions';
import AISuggestionPanel from './components/AISuggestionPanel';
import { getSuggestedMessageTitles, getExampleMessages } from './utils/messageUtils';

interface FollowUpItemProps {
  followUp: any;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, update: Partial<any>) => void;
  campaignType?: string;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({
  followUp,
  index,
  isOpen,
  onToggle,
  getMessageTitle,
  updateFollowUp,
  campaignType = 'event-invitation'
}) => {
  const [editMode, setEditMode] = useState(false);
  const [messageText, setMessageText] = useState(followUp.message || '');
  const [followUpTitle, setFollowUpTitle] = useState(followUp.name || getMessageTitle(index, followUp));
  
  const titleSuggestions: TitleSuggestion[] = getSuggestedMessageTitles(index);
  const exampleMessages = getExampleMessages(index);
  
  const handleUpdateTitle = (title: string) => {
    setFollowUpTitle(title);
    updateFollowUp(index, { name: title });
  };
  
  const handleUpdateMessage = (message: string) => {
    setMessageText(message);
  };
  
  const handleMessageSelect = (message: string) => {
    setMessageText(message);
  };
  
  const handleSave = () => {
    updateFollowUp(index, { 
      message: messageText,
      name: followUpTitle 
    });
    setEditMode(false);
  };
  
  const handleCancel = () => {
    setMessageText(followUp.message || '');
    setFollowUpTitle(followUp.name || getMessageTitle(index, followUp));
    setEditMode(false);
  };
  
  const handleAIMessageSuggestion = (suggestion: string) => {
    setMessageText(suggestion);
  };

  return (
    <div className="border rounded-md mb-4 bg-white overflow-hidden">
      <div 
        className={`p-4 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${isOpen ? 'border-b' : ''}`}
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">
              {getMessageTitle(index, followUp)}
            </h3>
            {index > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                +{followUp.delayDays} days
              </span>
            )}
          </div>
          {followUp.message ? (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {followUp.message}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic mt-1">No message content yet</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setEditMode(true);
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 p-0"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isOpen && !editMode && (
        <div className="p-4">
          <MessageView 
            message={followUp.message}
            delayDays={followUp.delayDays}
            isInitialMessage={index === 0}
            onEdit={() => setEditMode(true)}
            examples={exampleMessages}
            onSelectExample={handleMessageSelect}
          />
        </div>
      )}

      {isOpen && editMode && (
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Message title:</label>
            <div className="flex gap-2">
              <Input 
                value={followUpTitle}
                onChange={(e) => setFollowUpTitle(e.target.value)}
                placeholder="Enter a title for this message"
                className="text-sm"
              />
              <AITitleSuggestions 
                campaignType={campaignType}
                followUpIndex={index}
                onTitleSelect={handleUpdateTitle}
              />
            </div>
            {titleSuggestions.length > 0 && (
              <SuggestedTitles 
                suggestions={titleSuggestions} 
                onSelect={handleUpdateTitle} 
              />
            )}
          </div>
          
          {index > 0 && (
            <MessageTiming 
              delayDays={followUp.delayDays}
              onDelayChange={(days) => updateFollowUp(index, { delayDays: days })}
            />
          )}
          
          <MessageContent 
            value={messageText}
            onChange={handleUpdateMessage}
            exampleMessages={exampleMessages}
            onSelectExample={handleMessageSelect}
            isInitialMessage={index === 0}
          />
          
          <AISuggestionPanel 
            campaignType={campaignType}
            onSuggestionSelect={handleAIMessageSuggestion}
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpItem;
