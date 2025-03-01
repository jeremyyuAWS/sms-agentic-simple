
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MessageTiming from './components/MessageTiming';
import SuggestedTitles from './components/SuggestedTitles';
import MessageContent from './components/MessageContent';
import MessageView from './components/MessageView';
import { getSuggestedMessageTitles, getExampleMessages } from './utils/messageUtils';

interface FollowUpItemProps {
  followUp: any;
  index: number;
  totalCount: number;
  getMessageTitle: (index: number, followUp: any) => string;
  updateFollowUp: (index: number, updates: Partial<any>) => void;
}

const FollowUpItem: React.FC<FollowUpItemProps> = ({
  followUp,
  index,
  totalCount,
  getMessageTitle,
  updateFollowUp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(followUp.name || getMessageTitle(index, followUp));
  const [editedDelay, setEditedDelay] = useState(followUp.delayDays?.toString() || "3");
  const [customMessage, setCustomMessage] = useState<string>(followUp.message || "");

  const isInitialMessage = index === 0;
  const suggestedTitles = getSuggestedMessageTitles(index);
  const exampleMessages = getExampleMessages(index);

  const handleSaveChanges = () => {
    updateFollowUp(index, {
      name: editedName,
      delayDays: parseInt(editedDelay, 10),
      message: customMessage
    });
    setIsEditing(false);
  };

  const handleSelectExampleMessage = (message: string) => {
    setCustomMessage(message);
  };

  return (
    <div 
      key={followUp.id} 
      className="relative bg-slate-50 border rounded-lg p-4 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-medium">
            {index + 1}
          </div>
          
          {!isEditing ? (
            <h4 className="font-medium">
              {getMessageTitle(index, followUp)}
            </h4>
          ) : (
            <div className="flex-1 flex gap-2">
              <Input 
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Message name"
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSaveChanges}
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        {!isEditing ? (
          <MessageView 
            message={followUp.message}
            delayDays={followUp.delayDays}
            isInitialMessage={isInitialMessage}
            onEdit={() => setIsEditing(true)}
            examples={exampleMessages}
            onSelectExample={handleSelectExampleMessage}
          />
        ) : (
          <div className="space-y-3 mt-4">
            <MessageTiming 
              value={editedDelay}
              onChange={setEditedDelay}
              isInitialMessage={isInitialMessage}
            />

            <SuggestedTitles 
              suggestions={suggestedTitles}
              onSelect={setEditedName}
            />
            
            <MessageContent 
              value={customMessage}
              onChange={setCustomMessage}
              exampleMessages={exampleMessages}
              onSelectExample={handleSelectExampleMessage}
              isInitialMessage={isInitialMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpItem;
